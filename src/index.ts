import { configDotenv } from "dotenv";
import { app } from "./app";
import db from "./config/db-connection";
import { Constants } from "./constants";

const PORT = Constants.PORT;

configDotenv();
db.connect()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://locahost:${PORT}`);
    })
})
.catch((err) => console.error('Failed to connect DB',err))