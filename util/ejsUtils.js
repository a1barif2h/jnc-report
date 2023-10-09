const parseFormValue = (value) => {
  if (value || value === 0) {
    return value;
  }

  return '-'
}

const isAddNAText = (type_visa) => {
  let eType = "E - Employment Visa";
  let piType = "PI - Private Investor Visa";
  let a3Type = "A3 - Work on Government Projects Visa";
  let eiType = "EI - Employment Type -1 Visa";

  if (type_visa !== eType && type_visa !== piType && type_visa !== a3Type && type_visa !== eiType) {
    return true;
  }
  return false;
};

const numberWithCommas = (x) => {
  if (!x) {
    return ""
  }
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

const formatDate = (dateString, format) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Replace format placeholders
  const formattedDate = format
    .replace('dd', day < 10 ? `0${day}` : day)
    .replace('MMM', month)
    .replace('yyyy', year);

  return formattedDate;
}


module.exports = {
  parseFormValue,
  numberWithCommas,
  isAddNAText,
  formatDate
}