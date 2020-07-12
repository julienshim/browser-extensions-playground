// console.log(`What was the IDMB users rating for ${title}\t${userRating[1]} IMDB users have given a weighted average vote of ${userRating[0].split("/").join(" / ")} for ${title}\t${ratingUrl}`);

clear()

var countryConverstion = {
  "USA": "United States",
  "UK": "United Kingdom"
}

var pluralCountries = {
  "United States": true,
  "France": false,
  "China": false,
  "India": false,
  "United Kingdom": true,
  "Poland": false,
  "Nigeria": false,
  "Egypt": false,
  "Iran": false,
  "Japan": false,
  "South Korea": false,
  "Hong Kong": false,
  "Turkey": false,
  "Pakistan": false,
  "Bangladesh": false,
  "Indonesia": false,
  "Trinidad and Tobago": false,
  "Nepal": false
}

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
    RuntimeHM: `RuntimeHM: ${data.replace('h', +(data[0]) > 1 ? " hours" : " hour").replace('min', ' minutes')}:`,
    "Release Date": `Release Date: ${data}`,
    Type: `Type: ${data}`
  };
  var temp;
  if (i === 0) {
    if(!!data.match(/\s{2,}TV-/)) {
      imdb['Title'] = [data.split(/\s{2,}TV-/)[0]]
    }
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
capturedData = document.querySelector("div.ratings_wrapper") && document.querySelector("div.ratings_wrapper").innerText.split(/\n/).slice(0,2);
if (capturedData) {
  var [rating, users] = capturedData;
  if (rating && users) {
    imdb['Rating'] = {
      "Average Rating": rating.replace("/", " / "),
      "No. of Users": users
  }
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
    } else if (data.includes('Sound Mix:')) {
      var [key, value] = ["Sound Mix", data.split('Sound Mix: ')[1].split(' | ')]
      imdb[key] = value
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
      if (key.includes('Runtime')) {
        key = 'RuntimeM';
        value[0] = value[0].replace('min', "minutes")
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

// console.log(imdb)

for (key in imdb) {

  function formatTitle(title, type) {
    var temp = title
        .replace(/[())]/g, " ")
        .trim()
        .split(/[\s]{2,}/);
    var [title, year] = temp;
    return ["the", year, type, title].join(" ");
  }

  var questions, question, answers, source;
  var title = imdb['Title'][0];
  var source = imdb['URL'][0];
  var fullType = imdb.hasOwnProperty('Type') ? imdb['Type'] : [`Film ${title.match(/\(\d{4}- \)|\(\d{4}\)|\(\d{4}–\d{4}\)/)[0]}`];
  var type = fullType[0].split(' ')[0].replace('TV', 'Television').toLowerCase();
  var possessive = type[type.length-1] === 's' ? "'" : "'s";
  var possessiveTitle = title.split(' (')[0][title.split(' (')[0].length-1] === 's' ?  "'" : "'s";
  var isInProduction = !!fullType[0].match(/\(\d{4}–\s\)/) && !fullType[0].includes('Mini');
  var fullTitle = formatTitle(title, type);

  // console.log(title, fullType, type, possessive)



  switch(key) {
    case "Also Known As":
      break;
    case "Aspect Ratio":
      break;
    case "Budget":
      questions = {
        P: "What is its budget?",
        E: `What is the ${type}${possessive} budget?`
      }
      question = `What is ${fullTitle}${possessiveTitle}?`
      answer = `The budget of ${fullTitle} is ${imdb.Budget[0]}`
      // answers = `The budget of ${}`
      // What's the film/tv series' budget?
      // The budget for ${title} is
      console.log(questions.p, question, answer, source);
      break;
    case "Color":
      break;
    case "Country":
      break;
    case "Creators":
      break;
    case "Cumulative Worldwide Gross":
      // How much did it gross worldwide?
      // How much did the film/tv series gross worldwide?
      // Film/tv has a cumulative world wide gross of ...
      break;
    case "Director":
      // Who stars/starred in it?
      // Who stars/starred in the film/tv series?
      // ${title} was directed by
      break;
    case "Directors":
      // Who stars/starred in it?
      // Who stars/starred in the film/tv series?
      // ${title} was directed by
      break;
    case "Filming Locations":
      break;
    case "Genre":
      break;
    case "Gross USA":
      break;
    case "Language":
      break;
    case "Motion Picture Rating (MPAA)":
      break;
    case "Opening Weekend USA":
      break;
    case "Original Title":
      break;
    case "Plot":
      // What is its plot?
      // What is the film/tv series' plot?
      // Plot
      break;
    case "Production Co":
      break;
    case "Rating":
      // What is its IMDb User rating?
      // What the IMDB User RAting for 
      // 2,685 IMDb users have given a weighted average vote of 6.4 / 10
      break;
    case "Release Date":
      // When was it released?
      // When was the tv/film released?
      // TV/film was released on (date) in (country)
      break;
    case "RuntimeM":
      // What is its runtime?
      // What is the film/tv show's runtime?
      // The runtime of blah is blah.
      break;
    case "RuntimeHM":
      break;
    case "Sound Mix":
      break;
    case "Stars":
      // Who stars/starred in it?
      // Who stars/starred in the film/tv series?
      // ${title} was directed by
      break;
    case "Storyline":
      break;
    case "Title":
      break;
    case "Type":
      break;
      // Default element
    case "URL":
      // Default element
      break;
    case "Writer":
      break;
    case "Writers":
      // Who wrote it?
      // Who was the film tv series written by?
      // Film tv series was written by 
      break;
    default:
      console.error(`${key} has not been accounted for in this version.`)
  }
  // console.log(questions, answer, source)
}

