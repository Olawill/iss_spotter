/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
 
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
   
    const data = JSON.parse(body).ip;
    callback(null, data);
  });
};

// Fetch Lat and Long
const fetchCoordsByIP = function(ip, callback) {
 
  const url = 'https://ipwho.is/' + ip;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
   
    const data = JSON.parse(body);
    // if invalid ip address is provided
    if (!data.success) {
      const msg = `Success status was ${data.success}. Response is ${data.message} when fetching data for IP ${data.ip}. `;
      callback(Error(msg), null);
      return;
    }
    
    // Extract the latitude and longitutde
    const { latitude, longitude } = data;
    
    callback(null, {latitude, longitude});
  });
};

/** ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
 
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
   
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times for latitude ${coords.latitude} and longitude ${coords.longitude}. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    // Parse the body the response; converting to an object
    const data = JSON.parse(body).response;
    
    callback(null, data);
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  // Get the current IP address
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }

    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        callback(error, null);
        return;
      }

      fetchISSFlyOverTimes(data, (error, nextPasses) => {
        if (error) {
          callback(error, null);
          return;
        }

        callback(null, nextPasses);
      });
    });
  });
}


module.exports = { nextISSTimesForMyLocation };