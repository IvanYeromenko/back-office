import { useEffect } from "react";
import { useRouter } from "next/router";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormGroup,
  FormLabel,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  type IEmployeeSchema,
  useNotifications,
  useValidationSchema,
} from "@/hooks";
import type { IEmployeeFormValues } from "@/types";

export interface IEmployeeFormProps {
  formState?: IEmployeeFormValues;
  onSubmit?: (formValues: IEmployeeFormValues) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
  loading?: boolean;
  error?: string;
}

export const EmployeeForm = (props: IEmployeeFormProps) => {
  const {
    formState,
    onSubmit,
    submitButtonLabel,
    backButtonPath,
    loading,
    error,
  } = props;
  const notifications = useNotifications();
  const router = useRouter();
  const employeeSchema = (
    useValidationSchema("employeeManagement") as IEmployeeSchema
  ).employee;

  const handleSubmit = (values: IEmployeeFormValues) => {
    onSubmit?.(values);
  };

  useEffect(() => {
    if (error) {
      notifications.show(error, {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [error, notifications]);

  return (
    <Formik
      initialValues={
        formState || {
          first_name: "",
          last_name: "",
          email: "",
        }
      }
      validationSchema={employeeSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          autoComplete="off"
          sx={{ width: "100%" }}
        >
          <FormGroup>
            <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
              <Grid
                size={{ xs: 12, sm: 6 }}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <FormLabel htmlFor="first_name" sx={{ mb: 1 }}>
                  First Name
                </FormLabel>
                <TextField
                  id="first_name"
                  placeholder="First Name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.first_name &&
                    Boolean(formik.errors.first_name)
                  }
                  helperText={
                    formik.touched.first_name && formik.errors.first_name
                  }
                  fullWidth
                />
              </Grid>
              <Grid
                size={{ xs: 12, sm: 6 }}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <FormLabel htmlFor="last_name" sx={{ mb: 1 }}>
                  Last Name
                </FormLabel>
                <TextField
                  id="last_name"
                  placeholder="Last Name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.last_name && Boolean(formik.errors.last_name)
                  }
                  helperText={
                    formik.touched.last_name && formik.errors.last_name
                  }
                  fullWidth
                />
              </Grid>
              <Grid
                size={{ xs: 12, sm: 6 }}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <FormLabel htmlFor="email" sx={{ mb: 1 }}>
                  Email
                </FormLabel>
                <TextField
                  id="email"
                  placeholder="Email"
                  fullWidth
                  value={formik.values.email || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
            </Grid>
          </FormGroup>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              id="employee-back"
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push(backButtonPath || "/")}
            >
              Back
            </Button>
            <Button
              id="employee-submit"
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
            >
              {submitButtonLabel}
            </Button>
          </Stack>
        </Box>
      )}
    </Formik>
  );
};
