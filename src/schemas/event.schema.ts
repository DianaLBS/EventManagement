import { object, string, date, z } from 'zod';

const eventSchema = object({
    title: string().min(1, { message: "Title is required" }),
    description: string().min(1, { message: "Description is required" }),
    date: string().min(1, { message: "Date is required" }).refine((date) => {
        return 'Date must be a valid date';
    }),
    time: string().min(1, { message: "Time is required" }),
});

export default eventSchema;
