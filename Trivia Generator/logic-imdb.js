// console.log(`What was the IDMB users rating for ${title}\t${userRating[1]} IMDB users have given a weighted average vote of ${userRating[0].split("/").join(" / ")} for ${title}\t${ratingUrl}`);

clear()

var imdbGenres = [
  "Action",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Adventure",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film Noir",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Short Film",
  "Sport",
  "Superhero",
  "Thriller",
  "War",
  "Western",
  "Game Show",
  "News",
  "Reality-TV",
  "Talk Show",
  "Reality TV",
  "Short",
  "Sports"
];
var imdb = {};
var capturePoint, el, capturedData;

// Capture Plot, Director, Writers, Stars
capturePoint = document.querySelector("div.summary_text");
el = capturePoint;
capturedData = [];
while (el !== null) {
  capturedData.push(el.innerText);
  el = el.nextElementSibling;
}

capturedData.forEach((data, i) => {
  var format = {
    0: `Plot: <DO NOT USE THIS VALUE>`,
    1: data,
    2: data,
    3: data,
  };
  var temp = format[i].split(" | ")[0];
  var [key, value] = temp.split(/:\s{0,}/);
  imdb[key] = key === "Plot" ? [data.split(' See full summary')[0]] : value.split(", ");
});

// Capture Title, Rating, Time, Genre, Release
capturedData = document
  .querySelector("div.title_wrapper")
  .innerText.split(" | ");
capturedData.forEach((data, i) => {
  var format = {
    RuntimeHM: `RuntimeHM: ${data}:`,
    "Release Date": `Release Date: ${data}`,
    Type: `Type: ${data}`
  };
  var temp;
  if (i === 0) {
    if(!!data.match(/\(original title\)/)) {
      if(!!data.match(/\d{1,}h/) || !!data.match(/\d{1,}min/)) {
        var [title, originalTitle, RuntimeHM] = data.split(/\n/);
        imdb['Title'] = [title]
        imdb['Original Title'] = [originalTitle.split(" (")[0]]
        imdb['RuntimeHM'] = [RuntimeHM]
      } else if (!!data.match(/\nG|PG|PG-13|R|NC-17|Not Rated/)) {
        var [title, originalTitle, Rating] = data.split(/\n/);
        imdb['Title'] = [title]
        imdb['Original Title'] = [originalTitle.split(" (")[0]]
        if (imdb.hasOwnProperty('Motion Picture Rating (MPAA)')) {
          imdb['Motion Picture Rating (MPAA)'] = {...imdb['Motion Picture Rating(MPAA)'], "Short": [Rating]}
        } else {
          imdb['Motion Picture Rating (MPAA)'] = {"Short": [Rating]}
        }
      }
    } else {
      if(!!data.match(/\d{1,}h/) || !!data.match(/\d{1,}min/)) {
        var [title, RuntimeHM] = data.split(/\n/);
        imdb['Title'] = [title]
        imdb['RuntimeHM'] = [RuntimeHM]
      } else if (!!data.match(/\nG|PG|PG-13|R|NC-17/)) {
        var [title, Rating] = data.split(/\n/);
        imdb['Title'] = [title]
        if (imdb.hasOwnProperty('Motion Picture Rating (MPAA)')) {
          imdb['Motion Picture Rating (MPAA)'] = {...imdb['Motion Picture Rating(MPAA)'], "Short": [Rating]}
        } else {
          imdb['Motion Picture Rating (MPAA)'] = {"Short": [Rating]}
        }
      }
    }
    
  } else if (!!data.match(/\d{1,}h/) || !!data.match(/\d{1,}min/)) {
    temp = format["RuntimeHM"];
    if (temp.includes('(')) {
      var [title, runtime] = temp.split(/\n/);
      temp = `RuntimeHM: ${runtime}`;
      imdb['Title'] = [title.split(/:\s{0,1}/)[1]];
    }
  } else if (data.includes(",")) {
    var genres = data.split(", ");
    genres.forEach(genre => {
      if(imdbGenres.includes(genre)) {
        if (imdb.hasOwnProperty['Genre']) {
          if (!imdb['Genre'].includes(genre)) {
            imdb['Genre'].push(genre)
          }
        }
        imdb['Genre'] = [genre];
      } else {
        console.log(`${genre} should be added to the Known IMDb Genres List!`)
      }
    })
    temp = format["Genre"];
  } else if (!!data.match(/\([a-z]{2,}\)/i)) {
    temp = format["Release Date"];
    var year = `${temp.match(/\d{4}/)[0]}`
    imdb['Type'] = [`Film (${year})`]
  } else if (data.includes('Series')) {
    temp = format['Type'];
  }
  if (temp) { var [key, value] = temp.split(/:\s{0,}/) }
  if (key && value) { imdb[key] = [value]}
});

// IMDb User Rating
capturedData = document.querySelector("div.ratings_wrapper").innerText.split(/\n/).slice(0,2);
var [rating, users] = capturedData;
if (rating && users) {
  imdb['Rating'] = {
    "Average Rating": rating.replace("/", " / "),
    "No. of Users": users
  }
}

// MPAA Rating, Expanded Genre, and Storyline
capturePoint = document.querySelector("#titleStoryLine > h2");
capturedData = [];
el = capturePoint;
while (el !== null) {
  capturedData.push(el.innerText);
  el = el.nextElementSibling;
}

capturedData.forEach((data, i) => {
  if(data.includes('MPAA')) {
    var [key, value] = data.split(/\n/);
    if (imdb.hasOwnProperty(key)) {
      imdb[key] = {...imdb[key], "Detailed": [value.split(" | ")[0].replace("Rated ", "")]}
    } else {
      imdb[key] = {"Detailed": [value.split(" | ")[0].replace("Rated ", "")]}
    }
  }
  if(data.includes('Storyline')) {
    imdb['Storyline'] = [capturedData[i+1].split(' Written by')[0]]
  }
  if(data.includes('Genres')) {
    var genres = data.split(/:\s{0,}/)[1].split(" | ");
    genres.forEach(genre => {
      if(imdbGenres.includes(genre)) {
        if (imdb.hasOwnProperty['Genre']) {
          if (!imdb['Genre'].includes(genre)) {
            imdb['Genre'].push(genre)
          }
        }
        imdb['Genre'] = [genre];
      } else {
        console.log(`${genre} should be added to the Known IMDb Genres List!`)
      }
    })
  }
})

// Capture Country, Language, Release Date, AKA, Filming Locations, Budget, Opening Weekend, Gross, Cumulative Worldwide Gross, Production Co, Runtime, Sound Mix, Color, Aspect Ratio
capturePoint = document.querySelector("#titleDetails > h2");
el = capturePoint;
capturedData = [];
while (el !== null) {
  capturedData.push(el.innerText);
  el = el.nextElementSibling;
}

capturedData.forEach((data, i) => {
  if (data.includes(":") && !data.includes('Official Sites')) {
    if(data.includes('Aspect Ratio')) {
      var [key, value] = ["Aspect Ratio", data.split('Aspect Ratio: ')[1]]
      imdb[key] = [value]
    } else {
      var [key, value] = data.split(/:\s{0,}/)
      value = [value.split(/ See full summary| See more/)[0]];
      if (!!value[0].match(/\, | \| /) && !key.includes('Filming Locations')) {
        value = value[0].split(/, | \| /)
      }
      if (key.includes('Opening Weekend USA')) {
        var [earnings, date] = value;
        value = {
          "Opening Weekend USA Earnings": earnings,
          "Opening Weekend USA Date": date
        }
      }
      imdb[key] = value
    }
  }
  // var [key, value] = temp.split(/:\s{0,}/);
  // imdb[key] = key === "Plot" ? [data.split(' See full summary')[0]] : value.split(", ");
})


//Capture Source

capturedData = window.location.href.match(/https:\/\/www.imdb.com\/title\/tt+\d{1,}/)[0];
imdb['URL'] = [capturedData];


console.log(imdb);
