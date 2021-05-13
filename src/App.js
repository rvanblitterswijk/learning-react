import React, { useState } from 'react';
import axios from 'axios';

import styles from './App.module.css';
import { ReactComponent as Check } from './check.svg';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
 
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) => {
  switch(action.type) {
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
        data: state.data.filter(story => action.payload.objectID !== story.objectID),
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

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({type: 'STORIES_FETCH_INIT'});

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

  const handleRemoveStory = (item) => {
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


const SearchForm = ({
  searchTerm, onSearchSubmit, onSearchInput
}) => {
  return (
    <form onSubmit={onSearchSubmit} className={styles.SearchForm}>
      <InputWithLabel 
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <button 
        type="submit" 
        disabled={!searchTerm} 
        className={`${styles.button} ${styles.buttonLarge}`}
      >
        Submit
      </button>
    </form>
  );
}


const InputWithLabel = ({id, type = 'text', value, onInputChange, isFocused, children}) => {
  const inputRef = React.useRef();

  React.useEffect(
    () => { 
      if (inputRef.current && isFocused) {
        inputRef.current.focus();
      }
    },
    [isFocused]
  );

  return (
    <>
      <label htmlFor="id" className={styles.label}>{children}</label>
      &nbsp;
      <input 
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className={styles.input}
      />
    </>
  );
}


const List = ({list, onRemoveItem}) => {
  return list.map((item) => {
    return (
      <Item 
        key={item.objectID} 
        item={item} 

        onRemoveItem={onRemoveItem}
      />
    )
  })
}


const Item = ({item, onRemoveItem}) => {
  return (
    <div className={styles.item}>

      <span style={{ width: '40%'}}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>

      <span style={{ width: '10%' }}>
        <button 
          type="button" 
          onClick={() => onRemoveItem(item)}
          className={`${styles.button} ${styles.buttonSmall}`}
        >
          <Check height="18px" width="18px" />
        </button>
      </span>

    </div>
  )
}

export default App;
