import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridPaginationModel } from '@mui/x-data-grid';

interface IPaginationState {
    page: number;
    pageSize: number;
}

const INITIAL_PAGE_SIZE = 6;

const initialState: IPaginationState = {
    page: 0,
    pageSize: INITIAL_PAGE_SIZE,
};

const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        setPaginationModel: (state, action: PayloadAction<GridPaginationModel>) => {
            state.page = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
        resetPagination: () => initialState,
    },
});

export const { setPaginationModel, resetPagination } = paginationSlice.actions;
export default paginationSlice.reducer;
