export const isValidPhone = (phone: string) => /^\d{10}$/.test(phone);
export const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
