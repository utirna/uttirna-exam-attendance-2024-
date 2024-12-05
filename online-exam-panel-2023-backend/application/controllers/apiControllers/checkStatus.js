const statusController = (req, res, next) => {
	return res.status(200).json({
		call: 1,
		message: 'Connection successful',
	});
};

module.exports = statusController;
