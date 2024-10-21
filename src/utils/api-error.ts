export class ApiError extends Error {
    public statusCode: number;
    public data: any = null;
    public success: boolean;
    public errors: any[];
    public stack?: string;

    constructor(statusCode:number, message:string = 'Something went wrong', errors: any[]= [], stack?:string){
        super(message)
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors

        if(stack){
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

        Object.setPrototypeOf(this, new.target.prototype)
    }
} 