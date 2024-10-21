export class ApiResponse<T>{
    public StatusCode: number;
    public data: T;
    public message: string;
    public success: boolean;

    constructor(statusCode:number, data:T, message:string='Success'){
        this.StatusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}