// const cryptr = new Cryptr();
var crypto = require("crypto");
var iv = Buffer.from("0000000000000000");
var encrypt = function (data) {
  const key = process.env.SECRET_KEY;
  var hash = crypto.createHash("sha256");
  hash.update(key, "utf8");
  var sha256key = hash.digest();
    console.log("sha256key   "+sha256key);
  var keyBuffer = new Buffer.from(sha256key);
  //   console.log("decoded key:  " + decodeKey);

  var cipherBuffer = new Buffer.from(data, "hex");
  var aesEnc = crypto.createCipheriv("aes-256-ecb", keyBuffer, ""); // always use createCipheriv when the key is passed as raw bytes
  var output = aesEnc.update(data, "utf8", "hex");
  return output + aesEnc.final("hex");

  //   var decodeKey = crypto
  //     .createHash("sha256")
  //     .update(process.env.SECRET_KEY, "utf-8")
  //     .digest();
  //   console.log("decoded key:  " + decodeKey);
  //   var cipher = crypto.createCipheriv("aes-256-cbc", decodeKey, iv);

  //   return cipher.update(data, "utf8", "hex") + cipher.final("hex");
};
module.exports = {
  encrypt,
};