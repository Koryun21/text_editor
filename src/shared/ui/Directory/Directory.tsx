import React, {PropsWithChildren} from "react";
import {Item} from "../../config";
import Icon from "../Icon";

import styles from "./Directory.module.scss";

interface DirectoryProps {
  item: Item;
  handleDirectoryClick: (directoryId: string) => void;
}
const Directory: React.FC<PropsWithChildren<DirectoryProps>> = (props) => {
  const { children, item, handleDirectoryClick } = props;

  const isEmpty = !item.children.length;
  const isOpened = item.isOpened;
  const openedStatusIcon = isOpened ? 'down' : 'right';

  return (
    <>
      <div
        className={styles.label}
        onDoubleClick={() => handleDirectoryClick(item.id)}
      >
        {!isEmpty && (
          <Icon
            name={openedStatusIcon}
            onClick={() => handleDirectoryClick(item.id)}
          />
        )}
        <Icon name="folder" />
        {item.label}
      </div>
      {!isEmpty && isOpened && (
        <div className={styles.directoryContent}>{children}</div>
      )}
    </>
  );
};

export default Directory;