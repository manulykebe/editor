import React from 'react';

export const Editor = () => {
  return (
    <div className="h-full bg-gray-900 p-4">
      <pre className="text-gray-300 font-mono text-sm">
        {`// Welcome to the editor
function greeting() {
    console.log("Hello, World!");
}

// Start coding here...`}
      </pre>
    </div>
  );
};