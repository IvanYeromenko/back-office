import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PageContainer } from "@/components";
import { useDeleteEmployeeMutation, useGetEmployeeQuery } from "@/services";
import { useNotifications } from "@/hooks";
import type { IError } from "@/types";

export default function EmployeeShowPage() {
  const router = useRouter();
  const notifications = useNotifications();
  const { id } = router.query;
  const { data, error, isLoading } = useGetEmployeeQuery(
    {
      id: Number(id),
    },
    { skip: !id }
  );
  const [deleteEmployee, { error: deleteError, isLoading: deleteLoading }] =
    useDeleteEmployeeMutation();
  const { first_name, last_name, email } = data?.data || {};
  const pageTitle = `Employee ${id || ""}`;

  useEffect(() => {
    if (deleteError) {
      notifications.show((deleteError as IError).data?.error, {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [deleteError, notifications]);

  const handleDelete = useCallback(() => {
    const confirmed = confirm(
      `Do you wish to delete ${first_name} ${last_name}?`
    );
    if (confirmed) {
      deleteEmployee({ id: Number(id) }).then(() => router.push(`/`));
    }
  }, [deleteEmployee, first_name, id, last_name, router]);

  const renderShow = useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">{(error as IError).data?.error}</Alert>
        </Box>
      );
    }
    return data?.data ? (
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">First Name</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {first_name}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Last Name</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {last_name}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Email</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {email}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            id="employee-back"
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/")}
          >
            Back
          </Button>
          <Stack direction="row" spacing={2}>
            <Button
              id="employee-edit"
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/employee/${id}/edit`)}
            >
              Edit
            </Button>
            <Button
              id="employee-delete"
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              loading={deleteLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Box>
    ) : null;
  }, [
    data?.data,
    deleteLoading,
    email,
    error,
    first_name,
    handleDelete,
    id,
    isLoading,
    last_name,
    router,
  ]);

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: "Employees", path: "/" }, { title: pageTitle }]}
    >
      <Box sx={{ display: "flex", flex: 1, width: "100%" }}>{renderShow}</Box>
    </PageContainer>
  );
}
