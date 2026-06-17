class ApiResponse {
    static success(data, message = "Success") {
        return {
            status: "success",
            message,
            data,
        };
    }

    static error(message = "Something went wrong") {
        return {
            status: "error",
            message,
            data: null,
        };
    }
}

export default ApiResponse;
