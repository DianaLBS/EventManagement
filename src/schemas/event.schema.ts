import { object, string, date } from 'zod';

const eventSchema = object({
    title: string().min(1, { message: "Title is required" }),
    description: string().min(1, { message: "Description is required" }),
    date: date().refine(date => date <= new Date(), { message: "Date is required" }),
    time: string().min(1, { message: "Time is required" }),
    location: string().min(1, { message: "Location is required" }),
});

export default eventSchema;