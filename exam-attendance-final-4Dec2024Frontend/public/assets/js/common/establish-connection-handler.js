import { alertjs, showBsModal } from '../alertjs.js';
import { focusOnSearchInput } from '../candidate/candidate-attendance-handler.js';
import { Modal } from './modal-utility-handler.js';
import { isDevMode } from './project-mode-handler.js';
import { Toast } from './toasts.js';

focusOnSearchInput;
let backendUrl = '';

const wrapperClasses = document.querySelectorAll('.wrapper');

if (isDevMode()) {
    _session = {
        serverUrl: 'dummyrurl',
    };
}

// Pasted this if in establish connection
if (typeof _session !== undefined && _session) {
    try {
        if (!!_session.serverUrl) {
            let _protocol = _session.protocol;
            let _ipAddress = _session.ipAddress;
            let _port = _session.port;
            backendUrl = `${_protocol}://${_ipAddress}:${_port}`;

            document.getElementById('connnected-ip-container').innerText = _ipAddress;
            // focusOnSearchInput();
        }
    } catch (err) {
        console.error(`Error while constructing backend url : ${err}`);
    }
}

if (typeof _session !== undefined && _session) {
    if (!_session.serverUrl) {
        Modal.show('ipAddressModal');
    } else {
        focusOnSearchInput();
        wrapperClasses.forEach((wrapper) => {
            // console.log("Inth is bloo 22p");
            wrapper.style.display = 'block';
            wrapper.style.position = 'relative';
        });
        Modal.hide('ipAddressModal');
    }
} else {
    wrapperClasses.forEach((wrapper) => (wrapper.style.display = 'none'));
}

//Const elements
const serverConnectionBtn = document.getElementById('check-server-connection-btn');

const serverAddressInputTag = document.querySelector('#server-ip-address-name');

const protocolSelectTag = document.querySelector('#protocol');

const portInputTag = document.querySelector('#port');

const handleCheckForServerConnection = async (ip_address, protocol, port) => {
    try {
        //TO DO
        const _url = '/connection/establish-connection';
        const _res = await fetch(_url, {
            method: 'POST',
            body: JSON.stringify({
                ip_address: ip_address,
                protocol: protocol,
                port: port,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let { _success, _data, _message, _error } = await _res.json();

        if (isDevMode()) {
            _success = true;
        }

        if (_success) {
            Modal.hide('ipAddressModal');

            focusOnSearchInput();

            Toast.success('Connection Successful');

            wrapperClasses.forEach((wrapper) => {
                wrapper.style.display = 'block';
            });

            if (_data && _data._session) {
                let _protocol = _data._session.protocol;
                let _ipAddress = _data._session.ipAddress;
                let _port = _data._session.port;
                backendUrl = `${_protocol}://${_ipAddress}:${_port}`;
                document.getElementById('connnected-ip-container').innerText = _ipAddress;
            }
        } else {
            Toast.error('Connection Error: Could not establish a connection');
        }
    } catch (err) {
        console.error('Error while checking for the connection', err);
        Toast.error(err?.message);
    }
};

serverConnectionBtn?.addEventListener('click', () => {
    const serverIpAddress = serverAddressInputTag.value;
    const protocol = protocolSelectTag.value;
    const port = portInputTag.value;

    if (!serverIpAddress) {
        alert('Enter server ip address');
        return;
    }
    if (!port) {
        alert('Enter port number');
        return;
    }
    handleCheckForServerConnection(serverIpAddress, protocol, port);
});

export { backendUrl };
