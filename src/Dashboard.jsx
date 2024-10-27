import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import {
  createFolder,
  getFoldersWithFiles,
  getTreeFolders,
} from "./Services/Folder.service";
import { useLocation, useParams, Link } from "react-router-dom";
import "./App.css";
import queryString from "query-string";
import Accordion from "react-bootstrap/Accordion";
import { base_URL, fileUpload, getFileById } from "./Services/File.service";

const Viewer = () => {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [folders, setFolders] = useState([]);
  const [foldersMenu, setFoldersMenu] = useState([]);
  const [files, setFiles] = useState([]);

  // Functions to control modal visibility
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const foldersWithFiles = async () => {
    try {
      const data = await getFoldersWithFiles(id);
      // console.log("data", data);
      setFolders(data?.folders);
      setFiles(data?.files);
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  useEffect(() => {
    foldersWithFiles();
  }, [id]);

  useEffect(() => {
    const foldersMenu = async () => {
      const tree_folders = await getTreeFolders();
      setFoldersMenu(tree_folders);
    };
    foldersMenu();
  }, []);

  const handleFileUpload = async (uploadedFiles) => {
    if (uploadedFiles.length === 0) {
      alert("Please select a file!");
      return;
    }
    const formData = new FormData();

    // Append files to FormData
    if (uploadedFiles) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("my_file", uploadedFiles[i]);
      }
    }
    if (id !== "root") {
      formData.append("folderId", id);
    }
    for (const pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    try {
      const response = await fileUpload(formData);
      if (response?.message) {
        alert("File upload successful");
        // Add the uploaded file to the state
        const newFile = {
          ...response.file,
          filesize: response.file?.filesize || 0, // Ensure filesize is defined
        };

        setFiles((prevFiles) => [...prevFiles, newFile]);
      } else {
        alert("File upload failed!");
      }
      console.log("response", response);
    } catch (error) {
      console.error("Error uploading files: ", error.message);
      alert("An error occurred during file upload.");
    }
  };

  const modalData = async (data) => {
    setFolders([...folders, data]);
  };

  const fileSizeConversion = (size) => {
    console.log("FSize", size);
    const units = ["B", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  // Recursive FolderAccordion Component
  const FolderAccordion = ({ folders }) => {
    return (
      <Accordion>
        {folders?.map((folder, index) => (
          <Accordion.Item eventKey={index.toString()} key={folder.id}>
            <Accordion.Header>{folder.name}</Accordion.Header>
            <Accordion.Body>
              {folder.children?.length > 0 ? (
                <FolderAccordion folders={folder.children} />
              ) : (
                <p>No sub-folders</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  const deleteAFile = async (file_id) => {
    try {
      const response = await fetch(`${base_URL}${file_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });

      if (response.ok) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.id !== file_id)
        );
        alert("File deleted successfully");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete file: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error.message);
    }
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    window.location.href = "/login"; // Optionally, navigate to the login page
  };

  return (
    <div className="container">
      {/* Side panel */}
      <div className="side-panel">
        <Button
          variant="primary"
          onClick={handleOpen}
          className="bi bi-file-earmark-plus"
        >
          New Folder
        </Button>
        <div>
          {/* <title>File Upload</title> */}
          <h1>Upload a File</h1>
          <input
            type="file"
            name="sampleFile"
            id="file"
            onChange={(ev) => handleFileUpload(ev.target.files)}
          />
        </div>
        {/* Display Folders in the Side Panel */}
        <div className="folder-tree">
          <h2>Folder List</h2>
          <FolderAccordion folders={foldersMenu} />
        </div>
      </div>

      {/* Main content area */}
      <div className="content">
        <div className="row">
          {folders?.length > 0 || files?.length > 0 ? (
            <>
              {folders?.length > 0 &&
                folders?.map((folder) => (
                  <div className="col-md-4" key={folder.id}>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{folder?.name}</h5>
                        <Link
                          to={`/dashboard/${folder.id}`}
                          className="dfltlink col-span-2"
                        >
                          {"Open Folder"}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              {files?.length > 0 &&
                files?.map((file) => (
                  <div className="col-md-4" key={file.id}>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{file?.filename}</h5>
                        <h5 className="card-title">
                          {fileSizeConversion(file?.filesize)}
                        </h5>
                        <Button
                          variant="success"
                          onClick={() => getFileById(file.id)}
                        >
                          Download File
                        </Button>
                        {/* Delete button with confirmation modal */}
                        <DeleteButton
                          fileId={file.id}
                          deleteFile={deleteAFile} // Pass delete function to DeleteButton
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </>
          ) : (
            // Show 'No Content Exist' if both folders and files are empty
            <div className="col-36">
              <h5>No Content Exist</h5>
            </div>
          )}
        </div>
      </div>

      {/* Log Out Button at the top right */}
      <div className="d-flex justify-content-end mt-2">
        <Button variant="outline-danger" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      <MyModal
        show={show}
        handleClose={handleClose}
        parentFolders={folders}
        callbackFunction={modalData}
        folder_id={id}
      />
    </div>
  );
};

const MyModal = ({ show, handleClose, callbackFunction, folder_id }) => {
  const { search } = useLocation();
  const query = queryString.parse(search);
  const [folderName, setFolderName] = useState(""); // State to store the input value

  const onCloseModal = () => {
    setFolderName("");
    handleClose();
  };

  const handleSubmit = async () => {
    try {
      let parentId;
      if (folder_id === "root") {
        parentId = null;
      } else {
        parentId = folder_id;
      }
      const payload = {
        name: folderName,
        parentId: parentId,
      };
      const data = await createFolder({ payload });
      callbackFunction(data);
      alert("Folder created successfully");
      onCloseModal();
    } catch (error) {
      alert("Something went wrong.Try again.");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <ModalHeader closeButton>
          <ModalTitle> Folder Name</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <input
            type="text"
            className=""
            name={folderName}
            value={folderName}
            onChange={(ev) => setFolderName(ev.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const DeleteButton = ({ fileId, deleteFile }) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleConfirmDelete = async () => {
    await deleteFile(fileId);
    setShow(false);
  };

  return (
    <>
      {/* Delete Button to show the modal */}
      <Button variant="danger" onClick={handleShow} className="bi bi-trash3">
        Delete
      </Button>

      {/* Confirmation Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this file?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Viewer;
