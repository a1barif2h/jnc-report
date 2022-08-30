const capitalized = (words) => words.charAt(0).toUpperCase() + words.slice(1);

// THIS FUNCTION IS RESPONSE TO CONVERT NUMBER TO AMOUNT OF WORD.
function inWords (num) {
  try {
    const digitValueOne = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    const digitValueTwo = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; 
    let str = '';
    str += (n[1] != 0) ? (digitValueOne[Number(n[1])] || digitValueTwo[n[1][0]] + ' ' + digitValueOne[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (digitValueOne[Number(n[2])] || digitValueTwo[n[2][0]] + ' ' + digitValueOne[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (digitValueOne[Number(n[3])] || digitValueTwo[n[3][0]] + ' ' + digitValueOne[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (digitValueOne[Number(n[4])] || digitValueTwo[n[4][0]] + ' ' + digitValueOne[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (digitValueOne[Number(n[5])] || digitValueTwo[n[5][0]] + ' ' + digitValueOne[n[5][1]]) + '' : '';
    return str;
  } catch (err) {
    console.log("cant convert amount to string");
    console.log(err);
    return "-";
  }
}

// THIS FUNCTION IS RESPONSE TO MAINTAINED FULL AMOUNT LIKE: 152.36 OR 152
function amountInWords(num) {
  if(String(num).split(".").length > 1) {
    const strNum = String(num)
    const strNumArr = strNum.split('.')
    return capitalized(inWords(Number(strNumArr[0])) + 'point ' +inWords(Number(strNumArr[1])) + 'only')
  }

  return capitalized(inWords(num) + 'only')
}

module.exports = amountInWords;