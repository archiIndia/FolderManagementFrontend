import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { getParentFolders } from "./ApiCall";
import { isEmpty } from "./Helper";

const Viewer = () => {
  const [parentFolders, setParentFolders] = useState([]);
  const [show, setShow] = useState(false);

  // Functions to control modal visibility
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const parent_folders = async () => {
    try {
      const data = await getParentFolders();
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

  return (
    <div>
      <Button variant="primary" onClick={handleOpen}>
        NEW
      </Button>

      <MyModal
        show={show}
        handleClose={handleClose}
        parentFolders={parentFolders}
      />
    </div>
  );
};

const MyModal = ({ show, handleClose, parentFolders }) => {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <ModalHeader closeButton>
          <ModalTitle> Folder Name</ModalTitle>
        </ModalHeader>
        <input type="text" className="width-2"></input>

        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Viewer;
