import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";

// this will autoload any environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config({path: './server/.env'});

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) { // throw an error if we do not get our URI
    console.error("No ATLAS_URI environment variable has been defined in the .env");
    process.exit(1);
}

// try to connect to our database
connectToDatabase(ATLAS_URI)
    .then(() => { // if the function passes without error run this function
        const app = express();
        app.use(cors());

        //start express server
        app.listen(3000, () => { // listen takes a port to run on and a function to run when initializing
            console.log(`Server running at http://localhost:3000...`);
        })
    })  
    .catch(error => console.error(error));