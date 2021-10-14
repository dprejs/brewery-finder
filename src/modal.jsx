import React from 'react';
const Modal = ({ handleClose, show, children }) => {
  const modalDisplay = show ? "modal display-block" : "modal display-none";

  return (
    <div className={modalDisplay}>
      <div className='modal-main'>
        <div className='modal-children'>
        {children}
        </div>
        <button onClick={handleClose} className='modal-button'>
        close
        </button>
      </div>
    </div>
  );
};
export default Modal;