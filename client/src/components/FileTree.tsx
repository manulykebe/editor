import React from 'react';
import { ChevronRight, ChevronDown, FileText, Folder } from 'lucide-react';

interface FileTreeItemProps {
  name: string;
  type: 'file' | 'folder';
  level?: number;
  children?: FileTreeItemProps[];
}

const demoFiles: FileTreeItemProps[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'App.tsx', type: 'file' },
      { name: 'main.tsx', type: 'file' },
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Editor.tsx', type: 'file' },
          { name: 'FileTree.tsx', type: 'file' },
          { name: 'SidePanel.tsx', type: 'file' }
        ]
      }
    ]
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'index.html', type: 'file' },
      { name: 'favicon.ico', type: 'file' }
    ]
  }
];

const FileTreeItem = ({ name, type, level = 0, children }: FileTreeItemProps) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const paddingLeft = level * 12;

  return (
    <div>
      <div
        className="flex items-center py-1 px-4 hover:bg-gray-700 cursor-pointer text-sm"
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={() => type === 'folder' && setIsExpanded(!isExpanded)}
      >
        {type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown size={16} className="mr-1" />
            ) : (
              <ChevronRight size={16} className="mr-1" />
            )}
            <Folder size={16} className="mr-2 text-blue-400" />
          </>
        ) : (
          <>
            <span className="w-4 mr-1" />
            <FileText size={16} className="mr-2 text-gray-400" />
          </>
        )}
        {name}
      </div>
      {type === 'folder' && isExpanded && children && (
        <div>
          {children.map((item, index) => (
            <FileTreeItem
              key={`${item.name}-${index}`}
              {...item}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree = () => {
  return (
    <div className="text-gray-300">
      {demoFiles.map((item, index) => (
        <FileTreeItem key={`${item.name}-${index}`} {...item} />
      ))}
    </div>
  );
};