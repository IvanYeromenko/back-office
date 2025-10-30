export type TEmployeeRole = "Market" | "Finance" | "Development";

export interface IEmployee {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar?: string;
}

export interface IEmployeeFormValues {
    first_name?: string;
    last_name?: string;
    email?: string;
}

export interface IEmployeesRequest {
    page?: number;
    per_page?: number;
}

export interface IEmployeesResponse {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: IEmployee[]
}

export interface IEmployeeRequest {
    id: number;
}

export interface IEmployeeResponse {
    data: IEmployee
}
