const request = require('request-promise-native');


/*
 * Requests IP address from https://api.ipify.org/?format=json 
 * Returns: Promise of request for IP address, returned as JSON string
 */
const fetchMyIP = () => {
  return request('https://api.ipify.org/?format=json');
};

/* 
 * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function(body) {

  const url = 'https://ipwho.is/' + JSON.parse(body).ip;
  
  return request(url);
};

/*
 * Requests data from https://iss-flyover.herokuapp.com using provided lat/long data
 * Input: JSON body containing geo data response from ipwho.is
 * Returns: Promise of request for fly over data, returned as JSON string
 */
const fetchISSFlyOverTimes = function(data) {
  const { latitude, longitude } = JSON.parse(data);
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`)
};

/* 
 * Input: None
 * Returns: Promise for fly over data for users location
 */
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((body) => {
    const { response } = JSON.parse(body);
    return response;
  });
};

module.exports = { nextISSTimesForMyLocation };
