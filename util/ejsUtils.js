const parseFormValue = (value) => {
    if(value) {
        return value;
    }

    return '-'
}

const addNAText = (type_visa, value) => {
  let eType = "E - Employment Visa";
    let piType = "PI - Private Investor Visa";
    let a3Type = "A3 - Work on Government Projects Visa";
    let eiType = "EI - Employment Type -1 Visa";

    if (type_visa !== eType || type_visa !== piType || type_visa !== a3Type || type_visa !== eiType) {
      return "NA";
    }
    return value;
};

const numberWithCommas = (x) => {
    if(!x) {
      return ""
    }
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

module.exports = {
    parseFormValue,
    numberWithCommas,
    addNAText
}