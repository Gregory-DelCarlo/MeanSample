import * as mongodb from "mongodb";
import { Employee } from "./employee";

export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {} // returns all the collections in a pojo

export async function connectToDatabse(uri: string) {
    const client = new mongodb.MongoClient(uri); // get the correct mongodb cluster
    await client.connect(); // await the connection to the client

    const db = client.db("meanStackExample"); // get the database itself
    await applySchemaValidation(db); // make sure it fits our schema

    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;
}