import { Request, Response, NextFunction } from "express";
import  {AnyZodObject} from 'zod';

/**
 * Validates the request body against a given schema.
 * If the validation fails, it sends a 400 response with the validation error.
 * Otherwise, it calls the next middleware in the chain.
 * 
 * @param schema - The schema to validate the request body against.
 * @returns A middleware function that performs the validation.
 */
const validateSchema =  (schema: AnyZodObject) => {
    return async  (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body)
            next();
        }catch(error){
            console.error(error);
            res.status(400).json(error);
        }
    }
}

export default validateSchema;