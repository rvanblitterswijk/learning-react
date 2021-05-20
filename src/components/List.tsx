import styles from '../styles/App.module.css';
import { ReactComponent as Check } from '../styles/check.svg';
import { useSemiPersistentState } from '../shared/helpers'

var _ = require('lodash');

type ListProps = {
    list: Stories;
    onRemoveItem: (item: Story) => void;
};
type ItemProps = {
    item: Story;
    onRemoveItem: (item: Story) => void;
};

const List = ({ list, onRemoveItem }: ListProps) => {
    const [sortBy, setSortBy] = useSemiPersistentState('sortBy', 'title');

    return <>
        <div className={styles.columnHeaders}>
            <button onClick={() => setSortBy('title')} style={{ width: '40%' }} className={styles.columnHeader}>
                Title
            </button>
            <button onClick={() => setSortBy('author')} style={{ width: '30%' }} className={styles.columnHeader}>
                Author
            </button>
            <button onClick={() => setSortBy('num_comments')} style={{ width: '10%' }} className={styles.columnHeader}>
                Amount of comments
            </button>
            <button onClick={() => setSortBy('points')} style={{ width: '10%' }} className={styles.columnHeader}>
                Points
            </button>
            <button style={{ width: '10%' }} className={styles.columnHeader}>
                Remove item
            </button>
        </div>

        {_.sortBy(list, [sortBy]).map((item: Story) => {
            return (
                <Item
                    key={item.objectID}
                    item={item}

                    onRemoveItem={onRemoveItem}
                />
            )
        })}
        
    </>
}


const Item = ({ item, onRemoveItem }: ItemProps) => {
    return (
        <div className={styles.item}>

            <span style={{ width: '40%' }}>
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

export { List, Item };