export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export interface ApiError {
    errors: any;
    status: number;
    message: string;
    error_code?: string;
}
