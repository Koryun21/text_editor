import React, { useContext, useState } from 'react';

import styles from './Modal.module.scss';
import { StoreContext } from '../../shared/context/StoreProvider';
import { createPortal } from 'react-dom';
import { ItemType } from '../../shared/config';

const Modal = () => {
  const { modalIsOpen, setModalIsOpen, currentItemType, addNewItem } =
    useContext(StoreContext);
  const [itemName, setItemName] = useState('');

  const handleSave = () => {
    if (itemName) {
      setItemName('');
      addNewItem(itemName);
      setModalIsOpen(false);
    }
  };

  const handleCancel = () => {
    setItemName('');
    setModalIsOpen(false);
  };

  const modal = (
    <div className={styles.wrapper}>
      <div className={styles.modalForm}>
        <h1>
          {currentItemType === ItemType.FILE ? 'Add File' : 'Add Directory'}
        </h1>
        <input
          className={styles.nameInput}
          placeholder="New name"
          autoFocus
          value={itemName}
          onChange={(e) => {
            setItemName(e.target.value);
          }}
        />
        <div className={styles.formActions}>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );

  return modalIsOpen ? createPortal(modal, document.body) : null;
};

export default Modal;
