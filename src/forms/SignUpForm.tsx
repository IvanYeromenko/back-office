import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  IOnboardingSchema,
  useNotifications,
  useValidationSchema,
} from "@/hooks";
import { Formik } from "formik";
import { Box, Button, FormLabel, FormControl, TextField } from "@mui/material";
import { useRegisterMutation } from "@/services";
import { setAuthToken } from "@/utils";
import type { IError, ISignUpForm } from "@/types";

export const SignUpForm = () => {
  const signUpSchema = (
    useValidationSchema("authorization") as IOnboardingSchema
  ).signUp;
  const router = useRouter();
  const notifications = useNotifications();
  const [login, { isLoading, error }] = useRegisterMutation();

  const handleSubmit = (values: ISignUpForm) => {
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
      initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
      validationSchema={signUpSchema}
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
            <FormLabel htmlFor="name">Name</FormLabel>
            <TextField
              id="name"
              placeholder="Your name"
              autoComplete="name"
              autoFocus
              fullWidth
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </FormControl>
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
          <FormControl>
            <FormLabel htmlFor="password">Confirm Password</FormLabel>
            <TextField
              id="confirmPassword"
              type="password"
              placeholder="••••••"
              autoComplete="confirmPassword"
              fullWidth
              variant="outlined"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.confirmPassword)}
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
          </FormControl>
          <Button
            id="sign-up-submit"
            type="submit"
            loading={isLoading}
            fullWidth
            variant="contained"
          >
            Sign up
          </Button>
        </Box>
      )}
    </Formik>
  );
};
