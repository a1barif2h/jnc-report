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
    const gDate = new Date(givenDate).toLocaleString();
    return  moment(gDate).format('DD MMM, YYYY');
}

const getValidTillDate = (givenDate) => {
    return moment(givenDate).add(1, 'y').format('DD MMM, YYYY');
}

module.exports = {
    getCurrentFormattedDateTime,
    getApplicationDate,
    getFormatDate,
    getValidTillDate
}
