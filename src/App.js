import React from 'react';

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
        data: state.filter(story => action.payload.objectID !== story.objectID),
        isLoading: false,
        isError: false
      }
    default: 
      throw new Error()
  }
}

function App() {
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer, 
    { data: [], isLoading: false, isError: false }
  );
  
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  React.useEffect(() => {
    if (!searchTerm) return;
    
    dispatchStories({type: 'STORIES_FETCH_INIT'});

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then(response => response.json())
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        });
      })
      .catch(() => { 
        dispatchStories({
          type: 'STORIES_FETCH_FAILURE'
        });
      })
  }, [searchTerm]);

  const  handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel 
        id="search"
        value={searchTerm}
        isFocused

        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      
      <hr />

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
      <label htmlFor="id">{children}</label>
      &nbsp;
      <input 
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
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
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </div>
  )
}

export default App;
