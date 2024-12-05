const styles = {
    success: {
        background: '#059669',
        color: 'white',
    },

    warning: {
        background: '#fcd34d',
        color: 'brown',
    },

    error: {
        background: '#dc2626',
        color: 'white',
    },
};

const Toast = {
    success: (successMessage) => {
        Toastify({
            text: `${successMessage}`,

            // Duration is in milliseconds
            duration: 1500,
            destination: 'https://github.com/apvarun/toastify-js',
            newWindow: true,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'left', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: styles.success,
            onClick: function () {}, // Callback after click
        }).showToast();
    },

    warning: (warningMessage) => {
        Toastify({
            text: `${warningMessage}`,

            // Duration is in milliseconds
            duration: 1500,
            destination: 'https://github.com/apvarun/toastify-js',
            newWindow: true,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'left', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: styles.warning,
            onClick: function () {}, // Callback after click
        }).showToast();
    },

    error: (errorMessage) => {
        Toastify({
            text: `${errorMessage}`,

            // Duration is in milliseconds
            duration: 2500,
            destination: 'https://github.com/apvarun/toastify-js',
            newWindow: true,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'left', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: styles.error,
            onClick: function () {}, // Callback after click
        }).showToast();
    },
};

export { Toast };
