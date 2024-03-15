import React from 'react';
import styles from './MainLayout.module.scss';
import Editor from '../../widgets/Editor';
import FileList from "../../widgets/FileList";

const MainLayout = () => {
  return (
    <div className={styles.wrapper}>
      <FileList/>
      <Editor />
    </div>
  );
};

export default MainLayout;
