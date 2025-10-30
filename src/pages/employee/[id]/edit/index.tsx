import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { Alert, Box, CircularProgress } from "@mui/material";
import { PageContainer } from "@/components";
import { EmployeeForm } from "@/forms";
import { useGetEmployeeQuery, useUpdateEmployeeMutation } from "@/services";
import type { IEmployeeFormValues, IError } from "@/types";

export default function EmployeeEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useGetEmployeeQuery(
    {
      id: Number(id),
    },
    { skip: !id }
  );
  const { first_name, last_name, email } = data?.data || {};
  const [updateEmployee, { isLoading: saveIsLoading, error: saveError }] =
    useUpdateEmployeeMutation();

  const handleSubmit = useCallback(
    (values: IEmployeeFormValues) => {
      updateEmployee({
        id: Number(id),
        body: values,
      }).then(() => {
        router.push(`/`);
      });
    },
    [id, router, updateEmployee]
  );

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
      <EmployeeForm
        submitButtonLabel={"Save"}
        backButtonPath={`/employee/${id}`}
        formState={{
          first_name,
          last_name,
          email,
        }}
        onSubmit={handleSubmit}
        loading={saveIsLoading}
        error={saveError && (saveError as IError).data?.error}
      />
    ) : null;
  }, [
    data?.data,
    email,
    error,
    first_name,
    handleSubmit,
    id,
    isLoading,
    last_name,
    saveError,
    saveIsLoading,
  ]);

  return (
    <PageContainer
      title={`Edit Employee ${id || ""}`}
      breadcrumbs={[
        { title: "Employees", path: "/" },
        { title: `Employee ${id || ""}`, path: `/employee/${id}` },
        { title: "Edit" },
      ]}
    >
      <Box sx={{ display: "flex", flex: 1 }}>{renderShow}</Box>
    </PageContainer>
  );
}
