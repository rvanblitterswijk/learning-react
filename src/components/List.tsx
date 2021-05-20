import styles from '../styles/App.module.css';
import { ReactComponent as Check } from '../styles/check.svg';
import { useSemiPersistentState } from '../shared/helpers';

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
    const [sortReversed, setSortReversed] = useSemiPersistentState('sortReversed', 'false');

    if (sortReversed === 'true') {
        var items = _.reverse(_.sortBy(list, [sortBy]));
    } else {
        var items = _.sortBy(list, [sortBy]);
    }

    const handleSort = (sortColumn : string) => {
        if (sortColumn === sortBy) {
            toggleSortReversed();
        }
        setSortBy(sortColumn);
    }

    const toggleSortReversed = () => {
        if (sortReversed === 'true') {
            setSortReversed('false');
        } else {
            setSortReversed('true');
        }
    }

    return <>
        <div className={styles.columnHeaders}>
            <button onClick={() => handleSort('title')} style={{ width: '40%' }} className={styles.columnHeader}>
                Title
            </button>
            <button onClick={() => handleSort('author')} style={{ width: '30%' }} className={styles.columnHeader}>
                Author
            </button>
            <button onClick={() => handleSort('num_comments')} style={{ width: '10%' }} className={styles.columnHeader}>
                Amount of comments
            </button>
            <button onClick={() => handleSort('points')} style={{ width: '10%' }} className={styles.columnHeader}>
                Points
            </button>
            <button style={{ width: '10%' }} className={styles.columnHeader}>
                Remove item
            </button>
        </div>

        {items.map((item: Story) => {
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