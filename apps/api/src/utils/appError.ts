export class AppError extends Error {
    statusCode : number ;

    constructor(statusCode : number , message : number){
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this,AppError.prototype)

    }

}