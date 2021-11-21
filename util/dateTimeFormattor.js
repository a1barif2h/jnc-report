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

const getApplicationDate = (createdAt) => {
    try {
        const date = new Date(createdAt);
        return date.getDate() + " " + date.getMonth() + ", " + date.getFullYear();
    } catch (err) {
        return "_";
    }
}

module.exports = {
    getCurrentFormattedDateTime,
    getApplicationDate
}
