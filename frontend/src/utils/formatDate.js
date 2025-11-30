export const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

export const formatDateOnly = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

export const formatTimeOnly = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

