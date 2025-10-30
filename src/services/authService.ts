import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL, API_PATH } from '@/api';
import type { ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse } from '@/types';

export const authApi = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers) => {
            headers.set('x-api-key', 'reqres-free-v1');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        register: builder.mutation<IRegisterResponse, IRegisterRequest>({
            query: (credentials) => ({
                url: API_PATH.REGISTER,
                method: 'POST',
                body: credentials,
            }),
        }),
        login: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (credentials) => ({
                url: API_PATH.LOGIN,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
