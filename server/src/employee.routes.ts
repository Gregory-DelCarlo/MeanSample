import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const employeeRouter = express.Router(); //create an express router
employeeRouter.use(express.json()); // use json format

// create a root for employees (this is your index route)
employeeRouter.get("/", async (_req, res) => {
    try { // try to get all the employees
        // wait to move on until all employees are found
        const employees = await collections.employees.find({}).toArray(); //using the find method on a MDB collection with an empty object return all
        res.status(200).send(employees); // send the employees list; this will bee in json
    } catch (error) { // catch any errors that arise
        res.status(500).send(error.message) // send the error in json format
    }
});

//create a show route
employeeRouter.get("/:id", async (req, res) => { //:id is a url var
    try {
        const id = req?.params?.id; // using the ? operator allows us to avoid throwing an error if one of these objects doesnt exist
        const query = { _id: new mongodb.ObjectId(id) }; //create a mongoDB ObjectId object
        const employee = await collections.employees.findOne(query);

        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send(`failed to find employee ${id}`)
        }
    } catch (error) {
        res.status(404).send(error.message)
    }
});

//create a new route
employeeRouter.post("/", async (req, res) => {
    try {
        const employee = req.body
        const result = await collections.employees.insertOne(employee); //insert user input employee object

        if (result.acknowledged) { // if result is successful
            res.status(201).send(`Created a new employee with ID: ${result.insertedId}`);
        } else {
            res.status(500).send("Failed to create a new employee");
        }
        res.status(200).send();
    } catch(error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

//create an update route
employeeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const employee = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.employees.updateOne(query, { $set: employee });

        if(result && result.matchedCount) {
            res.status(200).send(`Updated employee ${id}.`);
        } else if(!result.matchedCount) {
            res.status(404).send(`Failed to find employee ${id}`);
        } else {
            res.status(304).send(`failed to update employee ${id}`);
        }
    } catch(error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

//create a destroy route
employeeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.employees.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed employee ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove employee ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find employee ${id}`);
        }
    } catch(error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});