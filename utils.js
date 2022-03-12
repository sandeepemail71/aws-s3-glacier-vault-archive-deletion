const parseData = (data = '') => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Data Parsing error', error);
  }
};

module.exports = {
  parseData,
}