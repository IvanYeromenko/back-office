import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { authApi, employeeApi } from "@/services"

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer
})

export const setupStore = () => {
    return configureStore(
        {
            reducer: rootReducer,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware()
                    .concat(authApi.middleware)
                    .concat(employeeApi.middleware)
        }
    )
}

export type TRootState = ReturnType<typeof rootReducer>
export type TAppStore = ReturnType<typeof setupStore>
export type TAppDispatch = TAppStore['dispatch']
