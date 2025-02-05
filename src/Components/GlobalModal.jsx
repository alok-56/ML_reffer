import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const GlobalModal = ({ isOpen, toggle, title, body, footer }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg"> {/* Using size="lg" for a large modal */}
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>
        {footer || (
          <>
            <Button color="secondary" onClick={toggle}>
              Close
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default GlobalModal;
