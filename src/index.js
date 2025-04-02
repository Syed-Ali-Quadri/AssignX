import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 8002;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`The server is running on ${PORT}`)
    });
})
.catch((err) => {
    console.log("Error while running the server,", err);
})
