const fs = require('fs')

const baseUrl = './public'

const webcamImagesDir = `${baseUrl}/pics/webcam_images`

const createDir = () => {
	if (!fs.existsSync(webcamImagesDir)) {
		fs.mkdirSync(webcamImagesDir, { recursive: true })
	}
}

module.exports = { createDir, webcamImagesDir }
