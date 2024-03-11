import { object, string, date } from 'zod';

const eventSchema = object({
    title: string().min(1, { message: "Title is required" }),
    description: string().min(1, { message: "Description is required" }),
    date: string().refine(value => !isNaN(Date.parse(value)), {
        message: 'Date must be a valid date string',
      }),
    time: string().min(1, { message: "Time is required" }),
    location: string().min(1, { message: "Location is required" }),
});

export default eventSchema;