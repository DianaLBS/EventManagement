import { object, string, array } from 'zod';

/**
 * Represents the schema for a user.
 */
const userSchema = object({
    name: string({ required_error: "Name is required" }),
    email: string({ required_error: "Email is required" })
        .email("Not a valid email address"),
    password: string({ required_error: "Name is required" })
        .min(8, "Password must be at least  8 characters long"),
        roles: array(string()).nonempty("Role is required")
})

export default userSchema;
