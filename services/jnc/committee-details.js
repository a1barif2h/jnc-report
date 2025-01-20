const axios = require("axios");

const logger = require("../../util/logger");

const getCommitteeData = async () => {
  // const url = `${config.BEZA_APPLICATION_PDF_SERVICE}/application-pdf-service/api/v1/internal/generate-${reqData?.isAmendmentHistory ? 'history' : 'pdf'}`
  
  const url = `https://jsonplaceholder.typicode.com/todos/1`;
  
  logger.info(`url: ${url}`)

  try {
    const { data } = await axios.get(url)
    
    return data
  } catch (error) {
    logger.error(error)
  }
}

module.exports = {
  getCommitteeData
};