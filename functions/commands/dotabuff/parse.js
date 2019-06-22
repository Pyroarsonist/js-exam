const axios = require('axios');

const parse = async link => {
  const parsedData = await axios.get(`http://dotabuff.com/${link}`);
  if (!parsedData || parsedData.status !== 200) {
    console.error('Failed parse data from dotabuff');
    console.error(parsedData);
  }
  return parsedData.data;
};

exports.default = parse;
