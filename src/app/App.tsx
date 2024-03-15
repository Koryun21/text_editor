import React from 'react';
import SideBar from "../layouts/SideBar";
import MainLayout from "../layouts/MainLayout";
import Modal from "../widgets/Modal";

import styles from './App.module.scss'

import './global.scss';

function App() {
  return (
    <div className={styles.wrapper}>
      <SideBar/>
      <MainLayout/>
      <Modal/>
    </div>
  );
}

export default App;
