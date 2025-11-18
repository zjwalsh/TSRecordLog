import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FailureModal = ({ show, onHide, calabrioId, failureMessage }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Failure Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Conversion of Calabrio recording <span id="failure-id">{calabrioId}</span> failed!
                </p>
                <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    backgroundColor: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '4px'
                }}>
                    {failureMessage}
                </pre>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FailureModal;
