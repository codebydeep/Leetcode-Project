import { ApiResponse } from "../utils/api-response";

const healthCheck = async (req, res) => {
    try {
        console.log("logic to connect with DB")
        res.status(200).json(new ApiResponse(200,
            {message: "Server is running!!"}
        ))
    } catch (error) {
        return res.status(500).json(
      new ApiResponse(500, { message: "Server health check failed", error: error.message })
    );
    }
}

export default healthCheck