const crypto = require("crypto");
const iv = Buffer.from("0000000000000000");

const encrypt =  (data) => {
  const key = process.env.SECRET_KEY;
  const hash = crypto.createHash("sha256");
  hash.update(key, "utf8");
  const sha256key = hash.digest();
    // console.log("sha256key   "+sha256key);
  const keyBuffer = new Buffer.from(sha256key);

  const cipherBuffer = new Buffer.from(data, "hex");
  const aesEnc = crypto.createCipheriv("aes-256-ecb", keyBuffer, ""); // always use createCipheriv when the key is passed as raw bytes
  const output = aesEnc.update(data, "utf8", "hex");

  return output + aesEnc.final("hex");
};
module.exports = {
  encrypt,
};