import React, { useContext } from 'react';
import cn from 'classnames';

import { StoreContext } from '../../shared/context/StoreProvider';
import Icon from '../../shared/ui/Icon';

import styles from './FileList.module.scss';

const FileList = () => {
  const {
    activeFileList,
    data,
    activeFileId,
    setActiveFileId,
    handleRemoveFileTab,
  } = useContext(StoreContext);

  const currentTags = activeFileList.map((id) => {
    return data[id];
  });

  const handleRemove = (
    e: React.MouseEvent<HTMLSpanElement>,
    id: string,
  ) => {
    e.stopPropagation();
    handleRemoveFileTab(id);
  };

  return (
    <div className={styles.wrapper}>
      {currentTags.map((item) => {
        return (
          <div
            key={item.id}
            className={cn(styles.fileTab, {
              [styles.active]: item.id === activeFileId,
            })}
            onClick={() => setActiveFileId(item.id)}
          >
            <p>{item.label}</p>
            <Icon name="close" onClick={(e) => handleRemove(e, item.id)} />
          </div>
        );
      })}
    </div>
  );
};

export default FileList;
