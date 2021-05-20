import React from 'react';
import styles from '../styles/App.module.css';
import InputWithLabel from './InputWithLabel';
import RecentSearches from './RecentSearches';

type SearchFormProps = {
    searchTerm: string;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    recentSearches: string[];
    onClick: (search: string) => void
};

const SearchForm = ({
    searchTerm, onSearchSubmit, onSearchInput, recentSearches, onClick
}: SearchFormProps) => {
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

            <RecentSearches searches={recentSearches} onClick={onClick} />
        </form>
    );
}

export default SearchForm;