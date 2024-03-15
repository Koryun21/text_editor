import React, { useContext } from 'react';

import FileTree from '../../widgets/FileTree';
import Icon from '../../shared/ui/Icon';
import { StoreContext } from '../../shared/context/StoreProvider';
import { ItemType } from '../../shared/config';

import styles from './SideBar.module.scss';

const SideBar = () => {
  const {
    setModalIsOpen,
    setCurrentItemType,
    setSelectedItemId,
    handleDrop,
  } = useContext(StoreContext);

  const handleAddNewFile = () => {
    setCurrentItemType(ItemType.FILE);
    setModalIsOpen(true);
  };
  const handleAddNewDirectory = () => {
    setCurrentItemType(ItemType.DIRECTORY);
    setModalIsOpen(true);
  };

  const handleFileListWrapperClick = () => {
    setSelectedItemId('');
  };

  const dragHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Project Name</h2>
        <div className={styles.controlWrapper}>
          <Icon name="addFolder" onClick={handleAddNewDirectory} />
          <Icon name="addFile" onClick={handleAddNewFile} />
        </div>
      </div>
      <div
        className={styles.content}
        onClick={handleFileListWrapperClick}
        onDrop={(e) => handleDrop(e, '')}
        onDragLeave={dragHandler}
        onDragOver={dragHandler}
      >
        <FileTree />
      </div>
    </div>
  );
};

export default SideBar;
