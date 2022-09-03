import * as mongodb from "mongodb";

export interface Employee { //in typescript interfaces define the structure of an object
    name: string;
    position: string;
    title: "junior" | "senior" | "mid";
    id?: mongodb.ObjectId; // ? means this field is optional
}