import * as Yup from "yup";

type TForms = "authorization" | "employeeManagement";

export interface IOnboardingSchema {
  signIn: Yup.ObjectSchema<any>;
  signUp: Yup.ObjectSchema<any>;
}

export interface IEmployeeSchema {
  employee: Yup.ObjectSchema<any>;
}

export const useValidationSchema = (formName: TForms) => {
  if (formName === "authorization") {
    return {
      signIn: Yup.object().shape({
        email: Yup.string()
          .required("This field is required")
          .email("Email is not valid"),
        password: Yup.string()
          .required("This field is required")
          .length(10, "Password must contain 7 digits"),
      }),
      signUp: Yup.object().shape({
        name: Yup.string().required("This field is required"),
        email: Yup.string()
          .required("This field is required")
          .email("Email is not valid"),
        password: Yup.string()
          .required("This field is required")
          .length(10, "Password must contain 7 digits"),
        confirmPassword: Yup.string()
          .required("This field is required")
          .length(10, "Password must contain 7 digits")
          .oneOf([Yup.ref("password")], "Passwords must match"),
      }),
    };
  }

  if (formName === "employeeManagement") {
    return {
      employee: Yup.object().shape({
        first_name: Yup.string().required("This field is required"),
        last_name: Yup.string().required("This field is required"),
        email: Yup.string().required("This field is required"),
      }),
    };
  }

  return undefined;
};
