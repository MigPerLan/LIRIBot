require("dotenv").config();
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
var fs = require('fs');


function start() {
  console.log(`
   Please write a command:
   spotify-this-song (song name)
   movie-this (movie name)
   do-what-says
  ---------------------------------
  `);
}

// user input
var service = process.argv[2];
var command = process.argv;
var content = '';
for (var i = 3; i < command.length; i++) {
  if (i > 3 && i < command.length) {

    content += '+' + command[i];


  }
  else {

    content += command[i];


  }
}

// run spotify
function song() {
  var limit = 3;
  if (!content) {
    var limit = 5;
    content = 'The Sign';
    limit = 1;
  }
  spotify
    .search({ type: 'track', query: content, limit: limit })
    .then(function (response) {
      var tracks = response.tracks.items;
      tracks.forEach(function (track) {
        console.log(`
      ------------------------------------------------------
      Artist:${track.album.artists[0].name}
      Title:${track.name}
      Album: ${track.album.name}
      URL: ${track.preview_url}
      -------------------------------------------------------'`
        );
      });

    })
    .catch(function (err) {
      console.log(err);
    });


};
// OMBD
function ombd() {

  if (!content) {
    content = 'Mr.Nobody'
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + content + "&y=&plot=short&apikey=trilogy";
  // console.log(queryUrl);
  request(queryUrl, function (error, response, body) {
    // console.log(JSON.stringify(response));
    if (!error && response.statusCode === 200) {
      console.log(`
      ------------------------------
      Title:${JSON.parse(body).Title}
      Release Year:${JSON.parse(body).Year}
      IMBD Rating:${JSON.parse(body).Ratings[1].Value}
      Rotten Tomatoes Rating:${JSON.parse(body).Ratings[2].Value}
      Language:${JSON.parse(body).Language}
      Plot:${JSON.parse(body).Plot}
      Actors:${JSON.parse(body).Actors}
      --------------------------------
        `);

    }
  });
};
// do-what-it-says
function dwis(func) {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) return console.error(err);
    var prompt = data.split(", ");
    service = prompt[0];
    content = prompt[1];
    func();


  });
}

// run conditions
if (service === 'spotify-this-song') {
  song();

}
else if (service === 'movie-this') {
  ombd();
}
else if (service === 'do-what-it-says') {
  dwis(song);

}
else {
  start();
}



