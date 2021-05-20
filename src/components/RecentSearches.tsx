import React from 'react';
import styles from '../styles/App.module.css';

type RecentSearchesProps = {
    searches: string[];
    onClick: (search : string) => void
};

const RecentSearches = ({
    searches,
    onClick
}: RecentSearchesProps) => {
    if (searches.length < 1) {
        return (<></>);
    } else {
        return (
            <div>
            Recent searches:
            {searches.map((search: string, index) => {
                return (
                    <button onClick={() => onClick(search)} key={index} className={`${styles.button} ${styles.buttonSmall} ${styles.buttonRow}`}>{search}</button>
                )
            })}
            </div>
        );
    }
}

export default RecentSearches;