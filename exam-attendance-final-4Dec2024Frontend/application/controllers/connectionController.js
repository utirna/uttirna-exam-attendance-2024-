const connectionController = {

  establishConnection: async (req, res) => {
    try {
      const { ip_address, protocol, port } = req.body;

      // Validate IP address
      if (!ip_address) {
        return res.status(400).json({
          _success: false,
          _message: "Please provide an IP address.",
        });
      }

      // Construct the server URL and API endpoint
      const endPoint = "/api/v1/check-status";
      const serverUrl = `${protocol}://${ip_address}:${port}`;
      const callToServerApiUrl = `${serverUrl}${endPoint}`;

      console.log("Requesting server URL:", callToServerApiUrl);

      // Fetch the response from the server
      const response = await fetch(callToServerApiUrl);

      // Check if the response is in JSON format
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        // console.log("Response data:", data);

        // Destructure the relevant fields from the response
        const { call, message } = data;

        // Check if the connection is successful
        if (call === 1 && message === "Connection successful") {
          req.session.serverUrl = serverUrl;
          req.session.ipAddress = ip_address
          req.session.protocol = protocol;
          req.session.port = port;

          return res.status(200).json({
            _success: true,
            _message: "Connection established successfully.",
           _data : {
            _session : req.session
           }
          });
        } else {
          return res.status(400).json({
            _success: false,
            _message: message || "Failed to establish connection.",
          });
        }
      } else {
        // Handle non-JSON response
        const textResponse = await response.text();
        console.error("Non-JSON response received:", textResponse);

        return res.status(500).json({
          _success: false,
          _message: "Unexpected response format from the server.",
          _error: textResponse,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        _success: false,
        _message: "An error occurred while establishing the connection.",
        _error:  err,
      }); 
    }
  },
};

module.exports = connectionController;
