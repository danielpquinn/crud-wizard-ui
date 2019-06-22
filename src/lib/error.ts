export const getErrorMessage = (e: any): string => {
  console.error(e);
  return e && e.response && e.response.data && e.response.data.message || "Unexpected error";
};
