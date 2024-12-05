// const PROJECT_MODE = 'DEV';
const PROJECT_MODE = 'PROD';

const isDevMode = () => {
    return PROJECT_MODE === 'DEV';
};

const printDev = (statement) => {
    if (!isDevMode()) return;
    console.log(statement);
};

const doDev = (callback) => {
    if (!isDevMode()) return;

    callback();
};

export let CROP_WIDTH = 200;
export let CROP_HEIGHT = 240;

export { isDevMode, printDev, doDev };
