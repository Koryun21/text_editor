export enum ItemType {
  FILE = 'file',
  DIRECTORY = 'directory'
}

export interface Item {
  id: string;
  type: ItemType;
  label: string;
  parentId: string;
  children: string[];
  isOpened: boolean;
  content: string;
}
