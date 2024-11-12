export interface FileTreeItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileTreeItem[];
}