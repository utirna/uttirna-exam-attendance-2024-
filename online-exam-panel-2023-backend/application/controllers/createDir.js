const fs = require('fs');
const path = require('path');

const baseUrl = './public';

const webcamImagesDir = path.join(`${baseUrl}`, 'pics', `_webcam_images`);
const staffImageDir = path.join(`${baseUrl}`, 'pics', '_staff_images');

const createDir = () => {
	if (!fs.existsSync(webcamImagesDir)) {
		fs.mkdirSync(webcamImagesDir, { recursive: true });
	}
};

module.exports = { createDir, webcamImagesDir, staffImageDir };
