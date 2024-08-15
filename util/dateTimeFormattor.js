const moment = require("moment");
const logger = require("./logger");

const getCurrentFormattedDateTime = () => {
    try {
        const currentDate = new Date();
        return "_" + currentDate.getFullYear() + "_"
            + (currentDate.getMonth() + 1) + "_"
            + currentDate.getDate() + "_"
            + currentDate.getHours() + "_"
            + currentDate.getMinutes() + "_"
            + currentDate.getSeconds();
    } catch (err) {
        return "_";
    }
}

const getApplicationDate = (givenDate) => {
    try {
        const date = moment(givenDate);
        return date.format('DD MMM, yyyy');
    } catch (err) {
        return "_";
    }
}

const getFormatDate = (givenDate) => {
    return moment(givenDate).format('DD-MMM-YYYY')
}

const getFormatDateWithTime = (givenDate) => {
    let hours = givenDate.getHours();
    let minutes = givenDate.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return `${moment(givenDate).format('DD-MMM-YYYY')} ${strTime}`
}

// const getValidTillDate = (givenDate) => {
//     logger.warn("check is call for date %s", givenDate)
//     const formatString = 'DD MMM, YYYY';
//     const dateObj = moment(givenDate, formatString);
//     logger.warn("check is call for dateObj %s", dateObj)
//     const nextYearDateObj = dateObj.clone().add(365, 'days');
//     return nextYearDateObj.format(formatString);
    
// }

const getValidTillDate = (givenDate) => {
    logger.info("given Date for valid date %s", givenDate);

    // Convert Unix timestamp to a moment object
    const dateObj = moment(givenDate);

    // Format the date using the specified format
    const formatString = 'DD MMM, YYYY';
    const formattedDate = dateObj.format(formatString);

    logger.info("modify given date for dateObj %s", formattedDate);

    // Assuming you want to add 365 days to the given date
    const nextYearDateObj = dateObj.clone().add(365, 'days');
    const nextYearFormattedDate = nextYearDateObj.format(formatString);

    return nextYearFormattedDate;
}


const changeDateFormat = (formValue, key) => {
    logger.info(`Converting date for - ${key} = ${formValue[key]}`)
    if (
      formValue &&
      !formValue[key]
    ) {
      formValue[key] = "N/A"
    } else if(formValue[key] === "Invalid Date" && isNaN(new Date(formValue[key]))) {
        formValue[key] = "N/A"
    } else {
      const formatDate = getFormatDate(formValue[key])
      formValue[key] =  formatDate !== "Invalid date" && !isNaN(new Date(formatDate)) ? formatDate : formValue[key]
    }
    logger.info(`after format: ${key} = ${formValue[key]}`);
}

module.exports = {
    getCurrentFormattedDateTime,
    getApplicationDate,
    getFormatDate,
    getValidTillDate,
    getFormatDateWithTime,
    changeDateFormat
}
