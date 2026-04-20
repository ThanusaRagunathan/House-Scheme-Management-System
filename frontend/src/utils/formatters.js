/**
 * Formats a date string into DD/MM/YYYY
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formats a date string into DD/MM/YYYY at HH:MM AM/PM
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  const formattedDate = formatDate(dateString);
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight
  
  return `${formattedDate} at ${hours}:${minutes} ${ampm}`;
};

/**
 * Sorts houses by their reference numbers (handles H - 001, H001, etc.)
 */
export const sortHousesByReference = (houses) => {
  if (!Array.isArray(houses)) return [];
  return [...houses].sort((a, b) => {
    const codeA = String(a.referenceCode || a.houseCode || a.code || "");
    const codeB = String(b.referenceCode || b.houseCode || b.code || "");
    
    const numA = parseInt((codeA.match(/\d+/) || [0])[0], 10);
    const numB = parseInt((codeB.match(/\d+/) || [0])[0], 10);
    
    if (numA !== numB) return numA - numB;
    return codeA.localeCompare(codeB);
  });
};

