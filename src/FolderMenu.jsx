import React, { useState } from "react";

const FolderTree = ({ folder, onCreateFolder, onDelete, onFileUpload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleFolder = () => setIsOpen(!isOpen);

  return (
    <div style={{ marginLeft: "20px" }}>
      <div>
        <span onClick={toggleFolder} style={{ cursor: "pointer" }}>
          {folder.name} {folder.children.length > 0 && (isOpen ? "-" : "+")}
        </span>
        <button onClick={() => onCreateFolder(folder.id)}>New Folder</button>
        <button onClick={() => onDelete(folder.id)}>Delete</button>
        <input
          type="file"
          onChange={(e) => onFileUpload(e, folder.id)}
          multiple
        />
      </div>

      {/* Show files */}
      {folder.files.length > 0 && isOpen && (
        <div style={{ marginLeft: "20px" }}>
          {folder?.files?.map((file) => (
            <div key={file.id}>{file.name}</div>
          ))}
        </div>
      )}

      {/* Show child folders */}
      {isOpen &&
        folder?.children?.map((childFolder) => (
          <FolderTree
            key={childFolder.id}
            folder={childFolder}
            onCreateFolder={onCreateFolder}
            onDelete={onDelete}
            onFileUpload={onFileUpload}
          />
        ))}
    </div>
  );
};

export default FolderTree;
