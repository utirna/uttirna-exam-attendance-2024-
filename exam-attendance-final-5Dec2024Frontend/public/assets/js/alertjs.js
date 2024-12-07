let alertjs = {
  success: function (data, callback = () => {}) {
    swal
      .fire({
        title: data.t,
        text: data.m,
        icon: "success",
      })
      .then(function () {
        callback();
      });
  },
  warning: function (data, callback = () => {}) {
    swal
      .fire({
        title: data.t,
        text: data.m,
        icon: "warning",
      })
      .then(function () {
        callback();
      });
  },
  delete: function (callback = () => {}) {
    swal
      .fire({
        title: "सरद माहिती काढायची आहे का?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "होय",
        cancelButtonText: "नाही",
      })
      .then((willDelete) => {
        if (willDelete.value) {
          callback(true);
        } else {
          callback(false);
        }
      });
  },
  deleteSpl: function (text, callback = () => {}) {
    swal
      .fire({
        title: text,
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
      .then((willDelete) => {
        if (willDelete.value) {
          callback(true);
        } else {
          callback(false);
        }
      });
  },
  common: function (data) {
    swal(data.m);
  },
  input: function (data) {
    $(data.id).notify(data.m, { autoHideDelay: 2500 });
    //$.notify(data.m, { autoHideDelay: data.s });
  },
};

let state;
const useState = (defaultValue) => {
  if (state === null) {
    state = defaultValue;
  }

  // State setter function
  const setState = (newValue) => {
    state = newValue;
    // Here you would typically trigger a re-render in a real React environment
  };

  return [state, setState];
};

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

const showBsModal = (modalId) => {
  // new bootstrap.Modal(document.getElementById(modalId)).show();
}

const closeBsModal = (modalId) => {
  // new bootstrap.Modal(document.getElementById(modalId)).hide();
}

const safeParse = (_parseValue) => {
  if (_parseValue) {
    return JSON.parse(_parseValue);
  }
  return _parseValue;
};

export { useState, alertjs , isValidEmail, showBsModal, closeBsModal, safeParse};
