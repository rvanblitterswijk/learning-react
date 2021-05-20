import React, { useState } from 'react';
import axios from 'axios';
import { List } from './List';
import SearchForm from './SearchForm'
import styles from '../styles/App.module.css';
import {useSemiPersistentState} from '../shared/helpers'

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
    const getUrl = (searchTerm : string) => `${API_ENDPOINT}${searchTerm}`;
    const [urls, setUrls] = useState([getUrl(searchTerm)]);
    
    const handleSearchInput = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchTerm(event.target.value);
    }

    const handleSearchSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        if (getUrl(searchTerm) === urls[0]) {
            setUrls(urls);
        } else {
            setUrls(([getUrl(searchTerm)].concat(urls)).slice(0,4));
        }

        event.preventDefault();
    }

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });
        try {
            const result = await axios.get(urls[0]);
            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        }
    }, [urls]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = (item: Story) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item
        });
    }

    const submitNewInputValue = (input : string) => {
        setSearchTerm(input);
        if (getUrl(searchTerm) === urls[0]) {
            setUrls(urls);
        } else {
            setUrls(([getUrl(searchTerm)].concat(urls)).slice(0,4));
        }
    }

    const extractSearchTerm = (url: string) => url.replace(API_ENDPOINT, '');

    return (
        <div className={styles.container}>
            <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>
            <SearchForm
                searchTerm={searchTerm}
                onSearchSubmit={handleSearchSubmit}
                onSearchInput={handleSearchInput}
                onClick={submitNewInputValue}
                recentSearches={urls.slice(1,4).map(url => extractSearchTerm(url))}
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