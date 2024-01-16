import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({message, vote, onCancel, onConfirm }) => {
  const textClassName =
  vote === '-1' ? styles.redText :
  vote === '1' ? styles.greenText :
    styles.blackText

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <p className={styles.title}>{message}</p>
        <p className={textClassName}>
          {vote === '-1' ? 'Դեմ' :
           vote === '1' ? 'Կողմ' :
           'Ձեռնպահ'}
        </p>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Չեղարկել
          </button>
          <button className={styles.signButton} onClick={onConfirm}>
            Ստորագրել
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;