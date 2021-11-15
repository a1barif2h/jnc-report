const createCommaSeperatedStringFromArray = function (arr) {
    var flattenedString = "";
    for (let i = 0; i < arr.length; i++) {
        flattenedString += arr[i];
        if (i + 1 < arr.length) {
            flattenedString += ", ";
        }
    }
    return flattenedString;
}

const createSerialListOfTopContactedPeople = function(arr) {
    var serialListOfTopContactedPeople = "";
    for (let i = 0; i < arr.length; i++) {
        var row = (i + 1) + ". " + arr[i].partyB;
        row = `<li class="px-2">${row}</li>`;
        serialListOfTopContactedPeople += row;
        if (i + 1 < arr.length) {
            serialListOfTopContactedPeople += "\n";
        }
    }
    return serialListOfTopContactedPeople;
}

module.exports = {createCommaSeperatedStringFromArray, createSerialListOfTopContactedPeople}