import { Toast } from './toasts.js';

const Modal = {
    show: (modalId, callback = () => {}) => {
        try {
            const modalElement = document.getElementById(modalId);
            modalElement.style.display = 'block';
            callback();
        } catch (err) {
            console.error(err);
            Toast.error(`No ${modalId} modal found`);
        }
    },
    hide: (modalId, callback = () => {}) => {
        try {
            const modalElement = document.getElementById(modalId);
            modalElement.style.display = 'none';
            callback();
        } catch (err) {
            console.error(err);
            Toast.error(`No ${modalId} modal found`);
        }
    },
};

export { Modal };
