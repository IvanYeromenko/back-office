import { useCallback } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { EmployeeForm } from "@/forms";
import { PageContainer } from "@/components";
import { useCreateEmployeeMutation } from "@/services";
import type { IError, IEmployeeFormValues } from "@/types";

export default function CreatePage() {
  const router = useRouter();
  const [createEmployee, { isLoading, error }] = useCreateEmployeeMutation();

  const handleSubmit = useCallback(
    (values: IEmployeeFormValues) => {
      createEmployee({
        body: values,
      }).then(() => {
        router.push(`/`);
      });
    },
    [createEmployee, router]
  );

  return (
    <PageContainer
      title={`New Employee`}
      breadcrumbs={[{ title: "Employees", path: "/" }, { title: "New" }]}
    >
      <Box sx={{ display: "flex", flex: 1 }}>
        <EmployeeForm
          submitButtonLabel="Create"
          onSubmit={handleSubmit}
          loading={isLoading}
          error={error && (error as IError).data?.error}
        />
      </Box>
    </PageContainer>
  );
}
