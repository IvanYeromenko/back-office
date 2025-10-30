export interface ISignInForm {
    email: string
    password: string
}

export interface ISignUpForm {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface IRegisterResponse {
    id: string;
    token: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
}
