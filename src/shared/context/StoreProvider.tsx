import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Item, ItemType } from '../config';
import { v4 } from 'uuid';

interface IStoreContext {
  data: Record<string, Item>;
  selectedItemId: string;
  modalIsOpen: boolean;
  currentItemType: ItemType;
  activeFileId: string;
  activeFileList: string[];
  changeDirectoryVisibility: (directoryId: string) => void;
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentItemType: React.Dispatch<React.SetStateAction<ItemType>>;
  setDragItemId: React.Dispatch<React.SetStateAction<string>>;
  setDragItemNode: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setActiveFileId: (fileId: string) => void;
  setActiveFileContent: (value: string) => void;
  addNewItem: (label: string) => void;
  handleRemoveFileTab: (fileId: string) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, fileId: string) => void;
}

export const StoreContext = React.createContext<IStoreContext>({
  data: {},
  selectedItemId: '',
  modalIsOpen: false,
  currentItemType: ItemType.FILE,
  activeFileId: '',
  activeFileList: [],
  changeDirectoryVisibility: () => {},
  setSelectedItemId: () => {},
  setModalIsOpen: () => {},
  setCurrentItemType: () => {},
  addNewItem: () => {},
  setActiveFileContent: () => {},
  setActiveFileId: () => {},
  handleRemoveFileTab: () => {},
  setDragItemId: () => {},
  handleDrop: () => {},
  setDragItemNode: () => {},
});

const StoreProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [data, setData] = useState<Record<string, Item>>({});
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [currentItemType, setCurrentItemType] = useState<ItemType>(ItemType.FILE);
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [activeFileList, setActiveFileList] = useState<string[]>([]);
  const [dragItemId, setDragItemId] = useState<string>('');
  const [dragItemNode, setDragItemNode] = useState<HTMLElement | null>(null);

  const setActiveFileContent = (value: string) => {
    const activeFile = data[activeFileId];
    setData((prev) => ({
      ...prev,
      [activeFileId]: {
        ...activeFile,
        content: value,
      },
    }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropId: string) => {
    e.stopPropagation();
    if (!dragItemNode?.contains(e.target as HTMLElement)) {
      const dragItem = data[dragItemId];
      const dragItemParentId = dragItem.parentId;
      const dragItemParent: Item | undefined = data[dragItemParentId];

      const dropItem = data[dropId];
      const dropZoneId = dropItem
        ? dropItem.type === ItemType.DIRECTORY
          ? dropItem.id
          : dropItem.parentId
        : '';
      const dropZone: Item | undefined = data[dropZoneId];
      if (dropZoneId !== dragItemParentId) {
        if (!dropZoneId) {
          setData((prev) => ({
            ...prev,
            [dragItemParentId]: {
              ...dragItemParent,
              children: dragItemParent.children.filter(
                (id) => id !== dragItemId,
              ),
            },
            [dragItemId]: {
              ...dragItem,
              parentId: dropZoneId,
            },
          }));
        }

        if (!dragItemParentId) {
          setData((prev) => ({
            ...prev,
            [dropZoneId]: {
              ...dropZone,
              children: [...dropZone.children, dragItemId],
            },
            [dragItemId]: {
              ...dragItem,
              parentId: dropZoneId,
            },
          }));
        }

        if (dropZoneId && dragItemParentId) {
          setData((prev) => ({
            ...prev,
            [dropZoneId]: {
              ...dropZone,
              children: [...dropZone.children, dragItemId],
            },
            [dragItemParentId]: {
              ...dragItemParent,
              children: dragItemParent.children.filter(
                (id) => id !== dragItemId,
              ),
            },
            [dragItemId]: {
              ...dragItem,
              parentId: dropZoneId,
            },
          }));
        }
      }
    }
  };

  const addNewItem = (label: string) => {
    const selectedItem: Item | undefined = data[selectedItemId];

    const parentId = selectedItem
      ? selectedItem.type === ItemType.DIRECTORY
        ? selectedItem.id
        : selectedItem.parentId
      : '';

    const generatedId = v4();

    const newItem = {
      id: generatedId,
      type: currentItemType,
      children: [],
      isOpened: false,
      label: label,
      content: '',
    };

    if (parentId) {
      const parentItem = data[parentId];

      const newItemWithParent: Item = {
        ...newItem,
        parentId,
      };
      setData((prev) => ({
        ...prev,
        [generatedId]: newItemWithParent,
        [parentId]: {
          ...parentItem,
          isOpened: true,
          children: [...parentItem.children, generatedId],
        },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [generatedId]: { ...newItem, parentId: '' },
      }));
    }
  };

  const changeDirectoryVisibility = (directoryId: string) => {
    const currentDirectory = data[directoryId];
    setData((prev) => ({
      ...prev,
      [directoryId]: {
        ...currentDirectory,
        isOpened: !currentDirectory.isOpened,
      },
    }));
  };

  const handleSetActiveFileId = (fileId: string) => {
    setActiveFileId(fileId);
    if (!activeFileList.includes(fileId)) {
      setActiveFileList((prev) => [...prev, fileId]);
    }
  };

  const handleRemoveFileTab = (fileId: string) => {
    const newFileList = activeFileList.filter((id) => id !== fileId);
    setActiveFileId(newFileList[0] ?? '');
    setActiveFileList(newFileList);
  };

  useEffect(() => {
    const persistedData = JSON.parse(
      localStorage.getItem('persistedData') ??
        JSON.stringify({ data: {}, activeFileList: [], activeFileId: '' }),
    );
    if (!!Object.keys(persistedData.data).length) {
      setData(persistedData.data);
    }
    if (!!persistedData.activeFileList.length) {
      setActiveFileList(persistedData.activeFileList);
    }
    if (!!persistedData.activeFileId) {
      setActiveFileId(persistedData.activeFileId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'persistedData',
      JSON.stringify({ data, activeFileList, activeFileId }),
    );
  }, [data, activeFileList, activeFileId]);

  const value = {
    data,
    selectedItemId,
    modalIsOpen,
    currentItemType,
    activeFileId,
    activeFileList,
    changeDirectoryVisibility,
    setSelectedItemId,
    setModalIsOpen,
    setCurrentItemType,
    addNewItem,
    setActiveFileId: handleSetActiveFileId,
    setActiveFileContent,
    handleRemoveFileTab,
    setDragItemId,
    setDragItemNode,
    handleDrop,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;
