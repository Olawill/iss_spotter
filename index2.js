const { nextISSTimesForMyLocation } = require('./iss_promised');
const { getPasses } = require('./getPasses');

// see index.js for printPassTimes 
// copy it from there, or better yet, moduralize and require it in both files

// Call 
nextISSTimesForMyLocation()
  .then((passTimes) => {
    getPasses(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });