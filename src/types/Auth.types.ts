export type UserDataType = {
  id: number;
  name: string;
  email: string;
  profileImage: string;
};

export type LoginDatatype = {
  email: string;
  password: string;
};

export type SignUpDatatype = {
  name?: string;
  email?: string;
  password?: string;
  code?: string;
};

export type ErrorType = {
  loginError?: string | null;
  MFAError?: string | null;
  twoFaError?: string | null;
  signUpConfirmationError?: string | null;
  signUpError?: string | null;
  refreshError?: string | null;
};
