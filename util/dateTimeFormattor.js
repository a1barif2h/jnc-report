const moment = require("moment");

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
    return moment(givenDate).format('DD MMM, YYYY')
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
    return moment(givenDate).add(1, 'y').format('DD MMM, YYYY');
}

module.exports = {
    getCurrentFormattedDateTime,
    getApplicationDate,
    getFormatDate,
    getValidTillDate,
    getFormatDateWithTime
}
