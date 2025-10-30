import Cookies from 'js-cookie';

export const setAuthToken = (token: string) => {
    Cookies.set('auth_token', token, { expires: 7 });
};

export const getAuthToken = () => Cookies.get('auth_token');

export const removeAuthToken = () => Cookies.remove('auth_token');

export const isAuthenticated = () => !!getAuthToken();
