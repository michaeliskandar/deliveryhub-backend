import app from "./app.js";
import { connectDB } from "./config/database.js";
import { ENV } from "./config/env.js";

const start = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log(`Server running on port ${ENV.PORT}`);
    });
};

start();
