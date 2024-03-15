import React, { useContext } from 'react';
import cn from 'classnames';

import { Item, ItemType } from '../../shared/config';
import { StoreContext } from '../../shared/context/StoreProvider';

import styles from './FileTree.module.scss';
import Directory from "../../shared/ui/Directory";

interface FileTreeProps {
  item?: Item;
}
const FileTree: React.FC<FileTreeProps> = (props) => {
  const { item } = props;
  const {
    data,
    changeDirectoryVisibility,
    setSelectedItemId,
    selectedItemId,
    setActiveFileId,
    setDragItemId,
    handleDrop,
    setDragItemNode
  } = useContext(StoreContext);

  const firstLevelItems = Object.values(data).filter((item) => !item.parentId);

  const currentItemData = item?.children.map((id) => {
    return data[id];
  });

  const filteredData =
    item && currentItemData ? currentItemData : firstLevelItems;

  const sortedByAlphabet = filteredData.sort((a, b) =>
    a.label.toLowerCase() < b.label.toLowerCase() && a.type.toLowerCase() < b.type.toLowerCase()? -1 : 1,
  );

  const sortedByType = sortedByAlphabet.sort((a, b) =>
     a.type.toLowerCase() < b.type.toLowerCase() ? -1 : 1,
  );


  const handleItemClick = (
    e: React.MouseEvent<HTMLDivElement>,
    itemId: string,
  ) => {
    e.stopPropagation();
    setSelectedItemId(itemId);
  };

  const handleItemDoubleClick = (item: Item) => {
    if (item.type === ItemType.FILE) {
      setActiveFileId(item.id);
    }
  };

  const dragHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Item) => {
    e.stopPropagation();
    setDragItemNode(e.target as HTMLElement)
    setDragItemId(item.id);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragItemId('');
  };


  return (
    <div className={styles.wrapper}>
      {sortedByType.map((item) => (
        <div
          key={item.id}
          className={cn(styles.itemWrapper, {
            [styles.selectedItem]: selectedItemId === item.id,
          })}
          onMouseDown={(e) => handleItemClick(e, item.id)}
          onClick={(e) => handleItemClick(e, item.id)}
          onDoubleClick={() => handleItemDoubleClick(item)}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragLeave={dragHandler}
          onDragOver={dragHandler}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, item.id)}
        >
          {item.type === ItemType.FILE ? (
            item.label
          ) : (
            <Directory
              item={item}
              handleDirectoryClick={changeDirectoryVisibility}
            >
              <FileTree item={item} />
            </Directory>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileTree;
