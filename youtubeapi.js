// YoutubeApiBranch
$(document).ready(function() {
  console.log("ready!");
  //FIREBASE SAVED RECENT SEARCHED THIS SECTION
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDYFaKwZCcC6RsKkC6Oyd4Le3P-A_pKlNM",
    authDomain: "path2muzik-1529345243230.firebaseapp.com",
    databaseURL: "https://path2muzik-1529345243230.firebaseio.com",
    projectId: "path2muzik-1529345243230",
    storageBucket: "path2muzik-1529345243230.appspot.com",
    messagingSenderId: "40158218059"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var bandName = "";
  
  $("#find-artist").on("click", function(event) {
    event.preventDefault();
    bandName = $("#artist-input").val().trim();
    console.log(bandName);

    //PUSH CLICK DATA TO FIREBASE
    database.ref().push({
      band: bandName
    });
  });
  database.ref().on("child_added",function(childSnapshot) {console.log(childSnapshot.val());

      var recentBandName = childSnapshot.val().band;

      $("#recent-searches").prepend("<ul><li>" + recentBandName + "</li></ul>");
    },
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );

  //YOUTUBE BAND QUERY THIS SECTION
  $("#find-artist").on("click", function(event) {
    event.preventDefault();
    var keyword = $("#artist-input").val().trim().toLowerCase();
    var apikey = "AIzaSyCYpIVDYnDUF_X8RT4v_0DYoWuIxjnPMMI";
    // var keyword = "pink"; THIS LINE FOR TESTING BEFORE INPUT RECEIVED FROM TEAM
    var youtube = "https://www.youtube.com/watch?v=";
    var outerQueryURL =
      "https://www.googleapis.com/youtube/v3/search?q=" + keyword +"&part=snippet&type=video&maxResults=6&results=6&order=viewCount&key=" + apikey;
    $.ajax({
      url: outerQueryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      $("#tbody2").empty();
      // loop over response.items
      for (var i = 0; i < response.items.length; i++) {
        var videoId = response.items[i].id.videoId;
        var videoTitle = response.items[i].snippet.title;
        var videoLink = youtube + videoId;

        console.log(youtube + videoId);
        console.log(videoTitle);
        $("#tbody2").append(
          "<tr><td><a href=" + videoLink + ">" + videoTitle + "</a></td></tr>"
        );
      }
    });
  });

  $("#find-artist").on("click", function(event) {
    event.preventDefault();
    $("h4").hide();
    var keyword = $("#artist-input").val().trim();
    if (keyword !== "") {
      var url ="https://app.ticketmaster.com/discovery/v2/events.json?keyword=";
      console.log(keyword);
      $("#artist-input").val("");
      var key ="&countryCode=US&sort=date,asc&apikey=wzw1aN0lKG2c96suxa2buGqcNWjIodvq";
      var queryURL = url + keyword + key;

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          $("#tbody1").empty();
          console.log(response);
          var h = response._embedded.events;
          for (var i = 0; i < h.length; i++) {
            var tBody = $("#tbody1");
            var tRow = $("<tr>");
            var titleTd = $("<td>").text(response._embedded.events[i].name);
            var date = $("<td>").text(
              response._embedded.events[i].dates.start.localDate
            );
            var eventUrl = response._embedded.events[i].url;
            var url = $("<a>")
              .attr("href", eventUrl)
              .append(eventUrl);
            var ticketUrl = $("<td>").html(url);
            var imgURL = response._embedded.events[i].images[0].url;
            var image = $("<img style='width: 300px'>").attr("src", imgURL);
            var imageOnScreen = $("<td>").html(image);
            image.addClass("artistImg");
            tRow.append(titleTd, date, ticketUrl, imageOnScreen);
            tBody.append(tRow);
          }
        }).catch(err => {
          console.log(err);
          $("#artist-view").html("Sorry no results.");
        });
    } else {
      $("h4").show();
      $("h4").html("Invalid. No response for artist.");
    }
  });

  $("#find-city").on("click", function(event) {
    event.preventDefault();
    $("h4").hide();
    var state = $("#state-input")
      .val()
      .trim();
    var city = $("#city-input")
      .val()
      .trim();
    var letters = /^[A-Za-z]+$/;
    if (state.length === 2 && state !== "" && state.match(letters) &&(city !== "" && city.match(letters))) {
      var url = "https://app.ticketmaster.com/discovery/v2/events.json?";
      var country = "&countryCode=US&stateCode=";
      var key = "&sort=date,asc&apikey=wzw1aN0lKG2c96suxa2buGqcNWjIodvq";
      var queryURL = url + country + state + "&city=" + city + key;

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          $("tbody").empty();
          console.log(response);
          var h = response._embedded.events;
          for (var i = 0; i < h.length; i++) {
            var tBody = $("#tbody1");
            var tRow = $("<tr>");
            var titleTd = $("<td>").text(response._embedded.events[i].name);
            var date = $("<td>").text(
              response._embedded.events[i].dates.start.localDate
            );
            var url = $("<td>").text(response._embedded.events[i].url);

            var eventUrl = response._embedded.events[i].url;
            var pfive = $("<a>")
              .attr("href", eventUrl)
              .append(eventUrl);
            var p = $("<td>").html(pfive);
            var imgURL = response._embedded.events[i].images[0].url;
            var image = $("<img style='width: 300px'>").attr("src", imgURL);
            var imageOnScreen = $("<td>").html(image);
            image.addClass("artistImg");
            tRow.append(titleTd, date, p, imageOnScreen);
            tBody.append(tRow);
          }
        }).catch(err => {
          console.log(err);
          $("#artist-view").html("Sorry no results.");
        });
    } else {
      $("h4").show();
      $("h4").html("Invalid. You need to input a city and a state.");
    }
  });
});
