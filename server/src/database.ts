import * as mongodb from "mongodb";
import { Employee } from "./employee";

export const collections: {
    employees?: mongodb.Collection<Employee>; // casts employees to the Employees interface
} = {} // returns all the collections in a pojo

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri); // get the correct mongodb cluster
    await client.connect(); // await the connection to the client use because connect is async

    const db = client.db("meanStackExample"); // get the database itself
    await applySchemaValidation(db); // make sure it fits our schema

    const employeesCollection = db.collection<Employee>("employees"); //get the collection from the db
    collections.employees = employeesCollection; // set this equal to employees in our pojo
}

// update our collection with the JSON schema validation so our documents will always match the shape of our model
async function applySchemaValidation(db: mongodb.Db) { //TS lets us specify the type to accept
    const jsonSchema = {
        $jsonSchema:  {
            bsonType: "object",
            required: ["name", "position", "level"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required and is a string",
                },
                level: {
                    bsonType: "string",
                    description: "'level' is required and is one of 'junior', 'mid', or 'senior'",
                    enum: ["junior", "mid", "senior"],
                },
            },
        },
    };
    //try to apply the modification to the collection, if it doesnt exist then create it
    await db.command({
        collMod: "employees",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("employees", {validator: jsonSchema});
        }
    });
}

