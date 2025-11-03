import { useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  gridClasses,
  GridColDef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { PageContainer } from "../containers";
import { useDeleteEmployeeMutation, useGetEmployeesQuery } from "@/services";
import { useNotifications } from "@/hooks";
import { setPaginationModel } from "@/store/paginationSlice";
import { type TAppDispatch, TRootState } from "@/store";
import type { IEmployee, IError } from "@/types";

export const EmployeeList = () => {
  const router = useRouter();
  const notifications = useNotifications();
  const dispatch = useDispatch<TAppDispatch>();
  const paginationModel = useSelector(
    (state: TRootState) => state.paginationSlice
  );
  const { data, error, isLoading, refetch } = useGetEmployeesQuery({
    page: paginationModel.page + 1,
    per_page: paginationModel.pageSize,
  });
  const [deleteEmployee, { error: deleteError }] = useDeleteEmployeeMutation();
  const pageTitle = "Employees";

  const handlePaginationChange = (model: GridPaginationModel) => {
    dispatch(setPaginationModel(model));
  };

  useEffect(() => {
    if (deleteError) {
      notifications.show((deleteError as IError).data?.error, {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [deleteError, notifications]);

  const handleDelete = useCallback(
    (row: IEmployee) => {
      const confirmed = confirm(
        `Do you wish to delete ${row.first_name} ${row.last_name}?`
      );
      if (confirmed) {
        deleteEmployee({ id: row.id });
      }
    },
    [deleteEmployee]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: "ID", flex: 1 },
      { field: "first_name", headerName: "First Name", flex: 1 },
      { field: "last_name", headerName: "Last Name", flex: 1 },
      { field: "email", headerName: "Email", flex: 1 },
      {
        field: "actions",
        type: "actions",
        flex: 1,
        align: "right",
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Edit"
            onClick={() => router.push(`/employee/${row.id}/edit`)}
            id={`edit-${row.id}`}
          />,
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDelete(row)}
            id={`delete-${row.id}`}
          />,
        ],
      },
    ],
    [handleDelete, router]
  );

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: pageTitle }]}
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton
                id="refresh-button"
                size="small"
                aria-label="refresh"
                onClick={refetch}
              >
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Button
            id="create-button"
            variant="contained"
            onClick={() => router.push(`/new`)}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: "100%" }}>
        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity="error">{(error as IError).data?.error}</Alert>
          </Box>
        ) : (
          <DataGrid
            rows={data?.data || []}
            columns={columns}
            rowCount={data?.total || 0}
            pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            disableRowSelectionOnClick
            onRowClick={({ row }) => router.push(`/employee/${row.id}`)}
            loading={isLoading}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: "transparent",
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: "none",
                },
              [`& .${gridClasses.row}:hover`]: {
                cursor: "pointer",
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: "circular-progress",
                noRowsVariant: "circular-progress",
              },
              baseIconButton: {
                size: "small",
              },
            }}
          />
        )}
      </Box>
    </PageContainer>
  );
};
