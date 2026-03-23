export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isRequired = (value: string) => {
  return value.trim().length > 0;
};

export const minLength = (value: string, length: number) => {
  return value.trim().length >= length;
};

export const passwordsMatch = (password: string, confirm: string) => {
  return password === confirm;
};