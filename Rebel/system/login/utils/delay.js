// utils/delay.js
module.exports = function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
