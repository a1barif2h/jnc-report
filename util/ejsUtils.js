const {getFormatDate} = require("./dateTimeFormattor");

const parseFormValue = (value) => {
  if (value || value === 0) {
    return value;
  }

  return "-";
};

const isAddNAText = (type_visa) => {
  let eType = "E - Employment Visa";
  let piType = "PI - Private Investor Visa";
  let a3Type = "A3 - Work on Government Projects Visa";
  let eiType = "EI - Employment Type -1 Visa";

  if (
    type_visa !== eType &&
    type_visa !== piType &&
    type_visa !== a3Type &&
    type_visa !== eiType
  ) {
    return true;
  }
  return false;
};

const numberWithCommas = (x) => {
  if (!x) {
    return "";
  }
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const formatDate = (dateString, format) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Replace format placeholders
  const formattedDate = format
    .replace("dd", day < 10 ? `0${day}` : day)
    .replace("MMM", month)
    .replace("yyyy", year);

  return formattedDate;
};

const getNumberWithSuffix = (number) => {
  // Handle special cases for numbers ending in 11, 12, or 13
  const lastTwoDigits = number % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${number}th`;
  }
  const lastDigit = number % 10;
  switch (lastDigit) {
    case 1:
      return `${number}st`;
    case 2:
      return `${number}nd`;
    case 3:
      return `${number}rd`;
    default:
      return `${number}th`;
  }
};

const getPaymentDescription = (item) => {
  if (!item) return "...";

  const { lmsFeeType, lmsAppType, paymentNo } = item;

  const feeTypeSuffix = {
    EARNEST: "Money",
    SECURITY: "Deposit",
  };

  // Handle EARNEST and SECURITY cases
  if (lmsFeeType === "EARNEST" || lmsFeeType === "SECURITY") {
    return `${lmsFeeType} ${feeTypeSuffix[lmsFeeType]}`.trim();
  }

  // Handle other cases
  const suffix = getNumberWithSuffix(paymentNo);
  const isAnnual = lmsAppType === "ANNUAL";
  const upfrontPaymentText = "Payment";
  const annualPaymentText = "Rent";
  const paymentText =
    lmsFeeType === "UPFRONT" ? upfrontPaymentText : annualPaymentText;

  return `${suffix} ${isAnnual ? "Year" : ""} ${paymentText}`.trim();
};

const lmsFormatDate = (dateStr) => {
  if (!dateStr) {
    return null;
  }

  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date)) {
    return null;
  }

  // Format the date
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formattedDate;
}

const convertToBengali = (number) => {
  if (!number && number !== 0) {
    return '';
  }
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(number)
    .split('')
    .map((char) => {
      const digitValue = parseInt(char, 10);
      return Number.isNaN(digitValue) ? char : bengaliDigits[digitValue];
    })
    .join('');
};

const convertDateInBangla = (givenDate) => {
  const arr = givenDate.split('-')

  if (!arr?.length) return ''

  const day = arr[2];
  const month = arr[1];
  const year = arr[0];

  // console.log(`${convertToBengali(day)}-${convertToBengali(month)}-${convertToBengali(year)}`)
  return `${convertToBengali(day)}-${convertToBengali(month)}-${convertToBengali(year)}`
}

module.exports = {
  parseFormValue,
  numberWithCommas,
  isAddNAText,
  formatDate,
  getNumberWithSuffix,
  getPaymentDescription,
  lmsFormatDate,
  convertToBengali,
  convertDateInBangla
};
