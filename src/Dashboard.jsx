import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import { createFolder, getParentFolders } from "./Services/Folder.service";
import { isEmpty } from "./Helper";
import queryString from "query-string";
import { useLocation, useParams, Link } from "react-router-dom";
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

  const modalData = async (data) => {
    setParentFolders([...parentFolders, data]);
  };

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
        <div className="row">
          {parentFolders?.map((folder) => (
            <div className="col-md-4" key={folder.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{folder?.name}</h5>
                  {/* <p className="card-text">Card content</p> */}
                  <Link to={`/dashboard/${folder.id}`} className="dfltlink col-span-2">
                    {"Open Folder"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MyModal show={show} handleClose={handleClose} parentFolders={parentFolders} callbackFunction={modalData} />
    </div>
  );
};

const MyModal = ({ show, handleClose, parentFolders, callbackFunction }) => {
  const { search } = useLocation();
  const query = queryString.parse(search);
  const [folderName, setFolderName] = useState(""); // State to store the input value

  const onCloseModal = () => {
    setFolderName("");
    handleClose();
  };

  console.log("query", query);
  const handleSubmit = async () => {
    try {
      const payload = {
        name: folderName,
        userId: 1,
        parentFolderId: null,
      };
      const data = await createFolder({ payload });
      console.log("data", data);
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
          <input type="text" className="" name={folderName} value={folderName} onChange={(ev) => setFolderName(ev.target.value)} />
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

export default Viewer;
