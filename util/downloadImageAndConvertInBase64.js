const { default: axios } = require("axios");
const logger = require("./logger")


const downloadAndConvertImage = async (downloadUrl) => {
    try {
        const image = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
        const returnedB64 = Buffer.from(image.data).toString('base64');
        const imageB64 = `data:${image.headers["content-type"]};base64,${returnedB64}`;
        return imageB64
    } catch (error) {
        logger.error(error)
        return ""
    }
}

module.exports = { downloadAndConvertImage }