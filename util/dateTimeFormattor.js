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
    const gDate = new Date(givenDate).toLocaleDateString();
    // console.log("============gDate=========");
    // console.log(gDate);
    // console.log("============gDate=========");
    // const strArray=['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    // function getParsedDate(dateString){
    //     const date = new Date(dateString);
    //     const d = date.getDate();
    //     const m = strArray[date.getMonth()];
    //     const y = date.getFullYear();
    //     const finalDate = '' + (d <= 9 ? '0' + d : d) + ' ' + m + ', ' + y;
    //     return finalDate;
    // }
    // console.log(getParsedDate("2022-05-15T00:00:00+06:00"));
    return moment(gDate).format('DD MMM, YYYY') //  getParsedDate(givenDate); //moment(gDate).format('DD MMM, YYYY');
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
