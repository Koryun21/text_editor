import React, { useContext } from 'react';
import { StoreContext } from '../../shared/context/StoreProvider';

import styles from './Editor.module.scss';

const Editor = () => {
  const { data, activeFileId,setActiveFileContent } = useContext(StoreContext);
  const activeFileContent = data[activeFileId]?.content
  const handleTextAreaChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setActiveFileContent(e.target.value)
  }

  return (
    <React.Fragment key={activeFileId}>
      {!!activeFileId ? (
        <textarea className={styles.playground} defaultValue={activeFileContent} onChange={handleTextAreaChange}/>
      ) : (
        <div className={styles.empty}> Select any file</div>
      )}
    </React.Fragment>
  );
};

export default Editor;
