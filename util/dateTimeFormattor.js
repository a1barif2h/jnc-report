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
        // return date.getDate() + " " + date.getMonth() + ", " + date.getFullYear();
        return date.format('DD MMM, yyyy');
    } catch (err) {
        return "_";
    }
}

module.exports = {
    getCurrentFormattedDateTime,
    getApplicationDate
}
