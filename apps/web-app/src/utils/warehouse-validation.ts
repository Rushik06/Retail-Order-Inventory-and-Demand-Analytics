export const validateWarehouseName = (name: string): string => {

if (name.length < 2) {
return "Min 2 characters";
}

return "";
};

export const validateLocation = (location: string): string => {

const lettersOnly = /^[A-Za-z\s]+$/;

if (location.length < 2) {
return "Min 2 characters";
}

if (!lettersOnly.test(location)) {
return "Letters only";
}

return "";
};

export const isWarehouseFormValid = (
name: string,
location: string
): boolean => {

const lettersOnly = /^[A-Za-z\s]+$/;

return (
name.length >= 2 &&
lettersOnly.test(location) &&
location.length >= 2
);
};