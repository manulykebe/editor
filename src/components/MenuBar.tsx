import React from 'react';
import { ChevronDown } from 'lucide-react';

const menus = [
  {
    label: 'File',
    items: ['New File', 'Open File...', 'Save', 'Save As...', 'Exit']
  },
  {
    label: 'Edit',
    items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste']
  },
  {
    label: 'View',
    items: ['Command Palette...', 'Open View...', 'Appearance', 'Terminal']
  },
  {
    label: 'Help',
    items: ['Welcome', 'Documentation', 'About']
  }
];

export const MenuBar = () => {
  return (
    <div className="h-7 bg-gray-900 border-b border-gray-700 flex items-center px-2 text-sm">
      {menus.map((menu) => (
        <div
          key={menu.label}
          className="relative group px-3 h-full flex items-center hover:bg-gray-700 cursor-pointer"
        >
          <span className="flex items-center gap-1">
            {menu.label}
            <ChevronDown size={14} />
          </span>
          <div className="hidden group-hover:block absolute top-full left-0 w-48 bg-gray-800 border border-gray-700 shadow-lg z-50">
            {menu.items.map((item) => (
              <div
                key={item}
                className="px-4 py-1 hover:bg-gray-700 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};