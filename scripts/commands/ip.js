const axios = require('axios');

module.exports.config = {
  name: "lookup",
  version: "1.0.0",
  permission: 0,
  credits: "Rebel",
  prefix: false,
  description: "Lookup IP address information",
  category: "Information Retrieval",
  cooldowns: 3,
};

module.exports.run = async ({ api, event, args }) => {
  if (!args[0]) {
    return api.sendMessage("Please provide an IP address to lookup.", event.threadID, event.messageID);
  }

  const apiKey = "653d64585f8e4682b7e9215636401a6e"; // Tumar ipgeolocation.io API key
  const ipAddress = args[0];

  try {
    const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ipAddress}`);

    if (response.status === 200) {
      const data = response.data;

      const formattedResult = `
🤖 Here's what I found for IP address ${ipAddress}:

🌐 IP ADDRESS: ${data.ip}
🌍 CONTINENT CODE: ${data.continent_code}
🌎 CONTINENT NAME: ${data.continent_name}
🌐 COUNTRY CODE2: ${data.country_code2}
🌐 COUNTRY CODE3: ${data.country_code3}
📌 COUNTRY NAME: ${data.country_name}
🏛️ COUNTRY CAPITAL: ${data.country_capital}
🏞️ STATE/PROVINCE: ${data.state_prov}
🌆 CITY: ${data.city}
📮 ZIPCODE: ${data.zipcode}
🌍 LATITUDE: ${data.latitude}
🌍 LONGITUDE: ${data.longitude}
🇪🇺 Is EU: ${data.is_eu ? 'Yes' : 'No'}
📞 CALLING CODE: ${data.calling_code}
🌐 COUNTRY TLD: ${data.country_tld}
🗣️ LANGUAGES: ${data.languages}
🏳️ COUNTRY FLAG: ${data.country_flag}
🌐 GEONAME ID: ${data.geoname_id}
🌐 ISP: ${data.isp}
🌐 CONNECTION TYPE: ${data.connection_type || 'N/A'}
🏢 ORGANIZATION: ${data.organization}
💰 CURRENCY CODE: ${data.currency.code}
💰 CURRENCY NAME: ${data.currency.name}
💰 CURRENCY SYMBOL: ${data.currency.symbol}
🌍 TIME ZONE: ${data.time_zone.name}
🕒 OFFSET: ${data.time_zone.offset}
⏰ CURRENT TIME: ${data.time_zone.current_time}
🕒 CURRENT TIME (Unix): ${data.time_zone.current_time_unix}
🌞 Is DST: ${data.time_zone.is_dst ? 'Yes' : 'No'}
🌞 DST SAVINGS: ${data.time_zone.dst_savings}

🏠 FULL ADDRESS: ${data.city}, ${data.state_prov}, ${data.country_name}, ${data.zipcode}

🌐 GOOGLE MAP: https://www.google.com/maps?q=${data.latitude},${data.longitude}
`;

      api.sendMessage(formattedResult, event.threadID, event.messageID);
    } else {
      api.sendMessage("An error occurred while fetching IP information.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while fetching IP information.", event.threadID, event.messageID);
  }
};
