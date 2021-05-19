import React, { useState } from 'react';
import axios from 'axios';
import { List } from './List';
import SearchForm from './SearchForm'

import styles from '../styles/App.module.css';

type StoriesState = {
    data: Stories;
    isLoading: boolean;
    isError: boolean;
  };

interface StoriesFetchInitAction {
    type: 'STORIES_FETCH_INIT';
}
interface StoriesFetchSuccessAction {
    type: 'STORIES_FETCH_SUCCESS';
    payload: Stories;
}

interface StoriesFetchFailureAction {
    type: 'STORIES_FETCH_FAILURE';
}

interface StoriesRemoveAction {
    type: 'REMOVE_STORY';
    payload: Story;
}

type StoriesAction =
    | StoriesFetchInitAction
    | StoriesFetchSuccessAction
    | StoriesFetchFailureAction
    | StoriesRemoveAction;


const useSemiPersistentState = (
    key: string,
    initialState: string
): [string, (newValue: string) => void] => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (
    state: StoriesState,
    action: StoriesAction
) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                data: [],
                isLoading: true,
                isError: false
            }
        case 'STORIES_FETCH_SUCCESS':
            return {
                data: action.payload,
                isLoading: false,
                isError: false
            }
        case 'STORIES_FETCH_FAILURE':
            return {
                data: [],
                isLoading: false,
                isError: true
            }
        case 'REMOVE_STORY':
            return {
                data: state.data.filter((story: Story) => action.payload.objectID !== story.objectID),
                isLoading: false,
                isError: false
            }
        default:
            throw new Error()
    }
}

const App = () => {
    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        { data: [], isLoading: false, isError: false }
    );
    const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
    const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

    const handleSearchInput = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchTerm(event.target.value);
    }

    const handleSearchSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);
        event.preventDefault();
    }

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });

        try {
            const result = await axios.get(url);
            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        }


    }, [url]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = (item: Story) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item
        });
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>
            <SearchForm
                searchTerm={searchTerm}
                onSearchSubmit={handleSearchSubmit}
                onSearchInput={handleSearchInput}
            />

            {
                stories.isError && <p>Something went wrong ...</p>
            }
            {
                stories.isLoading ?
                    (<p>Loading ...</p>) :
                    (<List list={stories.data} onRemoveItem={handleRemoveStory} />)
            }
        </div>
    );
}

export default App;