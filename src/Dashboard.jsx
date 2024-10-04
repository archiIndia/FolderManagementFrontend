import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import { createFolder, getParentFolders } from "./Services/Folder.service";
import { isEmpty } from "./Helper";
import queryString from "query-string";
import { useLocation, useParams } from "react-router-dom";
import "./App.css";

const Viewer = () => {
  const { id } = useParams();
  const [parentFolders, setParentFolders] = useState([]);
  const [show, setShow] = useState(false);

  // Functions to control modal visibility
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const parent_folders = async () => {
    try {
      console.log(id)
      const data = await getParentFolders(id);
      if (isEmpty(data)) {
        throw new Error("No Parent Folder exist");
      }
      console.log(data);
      setParentFolders(data);
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  useEffect(() => {
    parent_folders();
  }, []);
  console.log(parentFolders)

  return (
    <div className="container">
      {/* Side panel */}
      <div className="side-panel">
        <i className="bi bi-file-plus">
          <Button variant="primary" onClick={handleOpen} className="bi bi-file-earmark-plus">
            NEW
          </Button>
        </i>
      </div>

      {/* Main content area */}
      <div className="content">
        {parentFolders?.map((folder)=>(
          <div className="card" key={folder.id}>
          <div className="card-body">
            <h5 className="card-title">{folder?.name}</h5>
            <p className="card-text"></p>
            <a href="#" className="card-link">
              Card link
            </a>
          </div>
        </div>
        ))}
        <MyModal show={show} handleClose={handleClose} parentFolders={parentFolders} />
      </div>
    </div>
  );
};

const MyModal = ({ show, handleClose, parentFolders }) => {
  const { search } = useLocation();
  const query = queryString.parse(search);
  const [folderName, setFolderName] = useState(""); // State to store the input value

  console.log("query", query);
  const handleSubmit = async () => {
    try {
      const payload = {
        name: folderName,
        userId: 1,
        parentFolderId: null,
      };
      const data = await createFolder({ payload });
      alert("Folder created successfully");
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
          <input type="text" className="" name={folderName} value={folderName} onChange={(ev) => setFolderName(ev.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>
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

export default Viewer;
