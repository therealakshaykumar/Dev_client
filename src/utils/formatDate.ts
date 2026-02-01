export const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return "";
  
  return date.toISOString().split("T")[0];
};

export const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return "Not specified";
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return "Not specified";
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};