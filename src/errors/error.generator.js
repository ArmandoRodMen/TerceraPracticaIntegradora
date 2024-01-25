export default class CustomError {
    static generateError(message, code, name) {
        // Create a new Error object with the provided message
        const error = new Error(message);
        
        // Assign additional properties to the error object
        error.code = code;
        error.name = name;
        
        // Throw the custom error
        throw error; 
    }
}