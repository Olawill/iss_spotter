const { nextISSTimesForMyLocation } = require('./iss');
const { getPasses } = require('./getPasses');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  getPasses(passTimes);
});

