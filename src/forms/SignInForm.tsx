import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  IOnboardingSchema,
  useNotifications,
  useValidationSchema,
} from "@/hooks";
import { Formik } from "formik";
import { Box, Button, FormLabel, FormControl, TextField } from "@mui/material";
import { useLoginMutation } from "@/services";
import { setAuthToken } from "@/utils";
import type { IError, ISignInForm } from "@/types";

export const SignInForm = () => {
  const signInSchema = (
    useValidationSchema("authorization") as IOnboardingSchema
  ).signIn;
  const router = useRouter();
  const notifications = useNotifications();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = (values: ISignInForm) => {
    login(values)
      .unwrap()
      .then((result) => {
        setAuthToken(result.token);
        router.push("/");
      });
  };

  useEffect(() => {
    if (error) {
      notifications.show((error as IError).data?.error, {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [error, notifications]);

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={signInSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              fullWidth
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              id="password"
              type="password"
              placeholder="••••••"
              autoComplete="password"
              fullWidth
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </FormControl>
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            variant="contained"
          >
            Sign in
          </Button>
        </Box>
      )}
    </Formik>
  );
};
