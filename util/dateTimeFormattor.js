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
    return moment(givenDate).format('DD MMMM, YYYY')
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

const getValidTillDate = (givenDate) => {
    return moment(givenDate).local().add(1, 'y').format('DD MMM, YYYY');
}

const changeDateFormat = (formValue, key) => {
    logger.info(`Converting date for - ${key} = ${formValue[key]}`)
    if (
      formValue &&
      !formValue[key]
    ) {
      formValue[key] = "N/A"
    } else {
      const formatDate = getFormatDate(formValue[key])
      // if formateDate is valid date change the value or pass original value
      formValue[key] =  formatDate !== "Invalid date" ? formatDate : formValue[key]
    }
  }

module.exports = {
    getCurrentFormattedDateTime,
    getApplicationDate,
    getFormatDate,
    getValidTillDate,
    getFormatDateWithTime,
    changeDateFormat
}
