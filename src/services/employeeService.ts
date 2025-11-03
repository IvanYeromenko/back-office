import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "@/utils";
import { API_PATH, API_URL } from "@/api";
import type {
    IEmployeeFormValues,
    IEmployeeRequest,
    IEmployeeResponse,
    IEmployeesRequest,
    IEmployeesResponse,
} from "@/types";

export const employeeApi = createApi({
    reducerPath: "employee",
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers) => {
            const token = getAuthToken();
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            headers.set("x-api-key", "reqres-free-v1");
            return headers;
        },
    }),
    tagTypes: ["Employee", "Employees"],
    endpoints: (builder) => ({
        getEmployees: builder.query<IEmployeesResponse, IEmployeesRequest>({
            query: ({ page = 1, per_page = 6 }) =>
                `${API_PATH.USERS}?page=${page}&per_page=${per_page}`,
            providesTags: ["Employees"],
        }),
        getEmployee: builder.query<IEmployeeResponse, IEmployeeRequest>({
            query: ({ id }) => API_PATH.USER(id),
            providesTags: (result, error, { id }) => [{ type: "Employee", id }],
        }),
        createEmployee: builder.mutation<IEmployeeResponse, { body: IEmployeeFormValues }>({
            query: ({ body }) => ({
                url: API_PATH.USERS,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Employees"],
        }),
        updateEmployee: builder.mutation<IEmployeeResponse, { id: number; body: IEmployeeFormValues }>({
            query: ({ id, body }) => ({
                url: API_PATH.USER(id),
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Employee", id },
                "Employees",
            ],
        }),
        deleteEmployee: builder.mutation<IEmployeeResponse, IEmployeeRequest>({
            query: ({ id }) => ({
                url: API_PATH.USER(id),
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Employee", id },
                "Employees",
            ],
        }),
    }),
});

export const {
    useGetEmployeesQuery,
    useGetEmployeeQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
} = employeeApi;
