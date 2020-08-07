console.clear()

var mcmode = false;

var countryConverstion = {
  USA: "United States",
  UK: "United Kingdom",
};

var pluralCountries = {
  "United States": true,
  France: false,
  China: false,
  India: false,
  "United Kingdom": true,
  Poland: false,
  Nigeria: false,
  Egypt: false,
  Iran: false,
  Japan: false,
  "South Korea": false,
  "Hong Kong": false,
  Turkey: false,
  Pakistan: false,
  Bangladesh: false,
  Indonesia: false,
  "Trinidad and Tobago": false,
  Nepal: false,
};

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
  "Talk-Show",
  "Reality TV",
  "Short",
  "Sports",
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
  imdb[key] =
    key === "Plot" ? [data.split(" See full summary")[0]] : value.split(", ");
});

// Capture Title, Rating, Time, Genre, Release
capturedData = document
  .querySelector("div.title_wrapper")
  .innerText.split(" | ");
capturedData.forEach((data, i) => {
  var format = {
    RuntimeHM: `RuntimeHM: ${data
      .replace("h", +data[0] > 1 ? " hours" : " hour")
      .replace("min", " minutes")}:`,
    "Release Date": `Release Date: ${data}`,
    Type: `Type: ${data}`,
  };
  var temp;
  if (i === 0) {
    if (!!data.match(/\s{1,}TV-/)) {
      var front = data.split(/\s{1,}TV-/)[0];
      if (!!front.match(/original title/)) {
        var [title, originalTitle] = front.split(/\s{1,}/);
        imdb["Title"] = [title];
        imdb["Original Title"] = [originalTitle];
      } else {
        imdb["Title"] = [front];
      }
    }
    if(data.includes(', ')) {
      var [title, genres] = data.split(/\n/)
      imdb['Title'] = [title];
      genres = genres.split(", ");
      genres.forEach((genre) => {
        if(imdb.hasOwnProperty('Genre')) {
          if (imdbGenres.includes(genre)) {
            if (!imdb['Genre'].includes(genre)){
              imdb["Genre"] = [...imdb['Genre'], genre];
            }
          } else {
              console.error(`${genre} should be added to the genre list!`)
          }
        } else {
            if (imdbGenres.includes(genre)) {
              imdb['Genre'] = [genre]
            } else {
              console.error(`${genre} should be added to the genre list!`)
            }
        }
      });
    }
    if(data.split(/\s{2}/)[0].includes('Approved')) {
      imdb['Title'] = [data.split(/\s{2,}/)[0].split(/\n/)[0]];
    }
    if (imdbGenres.includes(data.split(/\s{2,}/)[0].split(/\n/)[1])) {
      imdb['Title'] = [data.split(/\s{2,}/)[0].split(/\n/)[0]];
      imdb["Genre"] = [data.split(/\s{2,}/)[0].split(/\n/)[1]];
    }
    if (imdbGenres.includes(data.split(/\s{2,}/)[1])) {
      imdb["Title"] = [data.split(/\s{2,}/)[0]];
      imdb["Genre"] = [data.split(/\s{2,}/)[1]];
    }
    if (!!data.match(/\(original title\)/)) {
      if (!!data.match(/\d{1,}h/) || !!data.match(/\d{1,}min/)) {
        var [title, originalTitle, RuntimeHM] = data.split(/\n/);
        imdb["Title"] = [title];
        imdb["Original Title"] = [originalTitle.split(" (")[0]];
        imdb["RuntimeHM"] = [RuntimeHM];
      } else if (!!data.match(/\nUnrated|G$|PG|PG-13|R$|NC-17|Not Rated/)) {
        var [title, originalTitle, Rating] = data.split(/\n/);
        imdb["Title"] = [title];
        imdb["Original Title"] = [originalTitle.split(" (")[0]];
        if (imdb.hasOwnProperty("Motion Picture Rating (MPAA)")) {
          imdb["Motion Picture Rating (MPAA)"] = {
            ...imdb["Motion Picture Rating(MPAA)"],
            Short: [Rating],
          };
        } else {
          imdb["Motion Picture Rating (MPAA)"] = { Short: [Rating] };
        }
      }
    } else {
      if (!!data.match(/\d{1,}h/) || !!data.match(/\d{1,}min/)) {
        var [title, RuntimeHM] = data.split(/\n/);
        imdb["Title"] = [title];
        imdb["RuntimeHM"] = [RuntimeHM];
      } else if (!!data.match(/\nUnrated|G$|PG|PG-13|R$|NC-17|Not Rated/)) {
        var [title, Rating] = data.split(/\n/);
        imdb["Title"] = [title];
        if (imdb.hasOwnProperty("Motion Picture Rating (MPAA)")) {
          imdb["Motion Picture Rating (MPAA)"] = {
            ...imdb["Motion Picture Rating(MPAA)"],
            Short: [Rating],
          };
        } else {
          console.log('Why am I here? 2')
          imdb["Motion Picture Rating (MPAA)"] = { Short: [Rating] };
        }
      }
    }
  } else if (!!data.match(/\d{1,}h/) || !!data.match(/\d{1,}min/)) {
    temp = format["RuntimeHM"];
    if (temp.includes("(")) {
      var [title, runtime] = temp.split(/\n/);
      temp = `RuntimeHM: ${runtime}`;
      imdb["Title"] = [title.split(/:\s{0,1}/)[1]];
    }
  } else if (data.includes(",")) {
    var genres = data.split(", ");
    genres.forEach((genre) => {
      if(imdb.hasOwnProperty('Genre')) {
        if (imdbGenres.includes(genre)) {
          if (!imdb['Genre'].includes(genre)){
            imdb["Genre"] = [...imdb['Genre'], genre];
          }
        } else {
            console.error(`${genre} should be added to the genre list!`)
        }
      } else {
          if (imdbGenres.includes(genre)) {
            imdb['Genre'] = [genre]
          } else {
            console.error(`${genre} should be added to the genre list!`)
          }
      }
    });
    temp = format["Genre"];
  } else if (!!data.match(/\([a-z]{2,}\)/i)) {
    temp = format["Release Date"];
    var year = `${temp.match(/\d{4}/)[0]}`;
    imdb["Type"] = [`Film (${year})`];
  } else if (data.includes("Series")) {
    temp = format["Type"];
  }
  if (temp) {
    var [key, value] = temp.split(/:\s{0,}/);
  }
  if (key && value) {
    imdb[key] = [value];
  }
});

// IMDb User Rating
capturedData =
  document.querySelector("div.ratings_wrapper") &&
  document
    .querySelector("div.ratings_wrapper")
    .innerText.split(/\n/)
    .slice(0, 2);
if (capturedData) {
  var [rating, users] = capturedData;
  if (rating && users) {
    imdb["Rating"] = {
      "Average Rating": [rating.replace("/", " / ")],
      "No. of Users": [users]
    };
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
  if (data.includes("MPAA")) {
    var [key, value] = data.split(/\n/);
    if (imdb.hasOwnProperty(key)) {
      imdb[key] = {
        ...imdb[key],
        Detailed: [value.split(" | ")[0].replace("Rated ", "")],
      };
    } else {
      imdb[key] = { Detailed: [value.split(" | ")[0].replace("Rated ", "")] };
    }
  }
  if (data.includes("Storyline")) {
    imdb["Storyline"] = [capturedData[i + 1].split(" Written by")[0]];
  }
  if (data.includes("Genres")) {
    var genres = data.split(/:\s{0,}/)[1].split(" | ");
    genres.forEach((genre) => {
      if(imdb.hasOwnProperty('Genre')) {
        if (imdbGenres.includes(genre)) {
            if (!imdb['Genre'].includes(genre)) {
             imdb["Genre"] = [...imdb['Genre'], genre];
            }
            
        } else {
            console.error(`${genre} should be added to the genre list!`)
        }
      } else {
          if (imdbGenres.includes(genre)) {
            imdb['Genre'] = [genre]
          } else {
            console.error(`${genre} should be added to the genre list!`)
          }
      }
    });
  }
});

// Capture Country, Language, Release Date, AKA, Filming Locations, Budget, Opening Weekend, Gross, Cumulative Worldwide Gross, Production Co, Runtime, Sound Mix, Color, Aspect Ratio
capturePoint = document.querySelector("#titleDetails > h2");
el = capturePoint;
capturedData = [];
while (el !== null) {
  capturedData.push(el.innerText);
  el = el.nextElementSibling;
}

capturedData.forEach((data, i) => {
  if (data.includes(":") && !data.includes("Official Sites")) {
    if (data.includes("Aspect Ratio")) {
      var [key, value] = ["Aspect Ratio", data.split("Aspect Ratio: ")[1]];
      imdb[key] = [value];
    } else if (data.includes("Sound Mix:")) {
      var [key, value] = [
        "Sound Mix",
        data.split("Sound Mix: ")[1].split(" | "),
      ];
      imdb[key] = value;
    } else {
      var [key, value] = data.split(/:\s{0,}/);
      value = [value.split(/ See full summary| See more/)[0]];
      if (!!value[0].match(/\, | \| /) && !key.includes("Filming Locations")) {
        value = value[0].split(/, | \| /);
      }
      if (key.includes("Opening Weekend USA")) {
        var [earnings, date] = value;
        value = {
          "Opening Weekend USA Earnings": earnings,
          "Opening Weekend USA Date": date,
        };
      }
      if (key.includes("Runtime")) {
        key = "RuntimeM";
        value[0] = value[0].replace("min", "minutes");
      }
      imdb[key] = value;
    }
  }
  // var [key, value] = temp.split(/:\s{0,}/);
  // imdb[key] = key === "Plot" ? [data.split(' See full summary')[0]] : value.split(", ");
});

//Capture Source
capturedData = window.location.href.match(
  /https:\/\/www.imdb.com\/title\/tt+\d{1,}/
)[0];
imdb["URL"] = [capturedData];

// Questions container
var lines = [];

for (key in imdb) {
  function chain(array) {
    var length = array.length;
    if (length === 0) {
      return "";
    } else if (length === 1) {
      return `${array[0]}`;
    } else if (length === 2) {
      return `${array[0]} and ${array[1]}`;
    } else {
      return `${array.splice(0, array.length - 1).join(", ")}, and ${
        array[array.length - 1]
      }`;
    }
  }

  function formatTitle(title, type) {
    var temp = title
      .replace(/– \)|–\d{4}\)|\)/, "")
      .split(/[\s]{1,}\(/);
      var [title, year] = temp;
      return ["the", year, type, title].join(" ");

  }

  function formatReleaseDate(datelocale) {
    var [date, locale] = datelocale.replace(')', '').split(/\s{1}\(/);
    if (countryConverstion.hasOwnProperty(locale)) {
      locale = countryConverstion[locale];
    }
    return `in ${locale} on ${date}`
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  function formatRunTime(time) {
      if (!!time.match(/minutes|minute|hour|hours/)) {
        if (!!time.match(/1 hours|1 minutes/) && !time.match(/\d{2,} hours|\d{2,} minutes/)) {
          return time.replace('1 hours', '1 hour').replace('1 minutes', '1 minute');
        }
        return time;
      }
    var temp = time;
    if(!!time.match(/1h\s{0,}/) && !time.match(/\d{2,}h\s{0,}/)) {
      temp = temp.replace('h', ' hour')
    } else {
      temp = temp.replace('h', ' hours')
    }
    if(!!time.match(/1min\s{0,}/) && !time.match(/\d{2,}min\s{0,}/)) {
      temp = temp.replace('min', ' minute')
    } else {
      temp = temp.replace('min', ' minutes')
    }
    return temp;
  }

  function formatLocation(location, isRunning) {
    if (isRunning) {
    return location.replace('USA', 'the United States').replace('UK', 'the United Kingdom');
    }
    return location.replace('USA', 'United States').replace('UK', 'United Kingdom');

  }

  var questions = undefined;
  var question = undefined;
  var answer = undefined;
  var source = chain(imdb["URL"]);
  var fullType = imdb.hasOwnProperty("Type")
    ? imdb["Type"]
    : [`Film ${imdb['Title'][0].match(/\(\d{4}- \)|\(\d{4}\)|\(\d{4}–\d{4}\)/)[0]}`];
  var type = chain(fullType)
    .split(" (")[0]
    .replace("TV", "Television")
    .toLowerCase();
  var title = chain(
    type !== "film"
      ? [`${imdb["Title"]} ${chain(imdb['Type'][0].match(/\(\d{4}– \)|\(\d{4}\)|\(\d{4}–\d{4}\)/))}`]
      : imdb["Title"]
  );
  var possessive = type[type.length - 1] === "s" ? "'" : "'s";
  var possessiveTitle =
    title.split(" (")[0][title.split(" (")[0].length - 1] === "s" ? "'" : "'s";
  console.log(title, possessiveTitle, title.split(" (")[0][title.split(" (")[0].length - 1])
  var isInProduction =
    !!chain(fullType).match(/\(\d{4}–\s\)/) && !fullType[0].includes("Mini");
  var fullTitle = formatTitle(title, type, fullType[0]);

  function tense(string) {
    var past = {
      "is": "was",
      "stars": "starred",
      "directs": 'directed'
    };
    return isInProduction ? string : past[string];
  }

  switch (key) {
    case "Also Known As":
      break;
    case "Aspect Ratio":
      break;
    case "Budget":
      var budget = chain(imdb.Budget).includes("estimated")
        ? `an estimated ${chain(imdb.Budget)
            .split(" (")[0]
            .replace(/EUR/, "€")}`
        : chain(imdb.Budget).replace(/EUR/, "€");

      if (budget.includes('SEK')) {
        budget = `${budget.replace('SEK', "")} kronor`
      }
      questions = {
        p: `What ${tense("is")} its budget?`,
        e: `What ${tense("is")} the ${type}${possessive} budget?`
      };
      question = `What ${tense("is")} ${fullTitle}${possessiveTitle} budget?`;
      answer = `The budget of ${fullTitle} ${tense("is")} ${budget}.`;
      break;
    case "Color":
      break;
    case "Country":
      questions = {
        p: `What is its country of origin?`,
        e: `What is the ${type}${possessive} country of origin?`
      };
      question = `What is ${fullTitle}${possessiveTitle} country of origin?`;
      answer = `The country of origin of ${fullTitle} is ${formatLocation(chain(imdb['Country']), true)}.`;
      break;
    case "Creator":
        questions = {
          p: `Who is the creator of it?`,
          e: `Who is the creator of the ${type}?`
        };
        question = `Who is the creator of ${fullTitle}?`;
        answer = `The creator of ${fullTitle} is ${chain(imdb['Creator'])}.`;
        break;
    case "Creators":
      questions = {
        p: `Who is the creator of it?`,
        e: `Who is the creator of the ${type}?`
      };
      question = `Who is the creator of ${fullTitle}`;
      answer = `The creators of ${fullTitle} are ${chain(imdb['Creators'])}.`;
      break;
    case "Cumulative Worldwide Gross":
      var gross = imdb["Cumulative Worldwide Gross"];
      questions = {
        p: "How much did it gross worldwide?",
        e: `How much did the ${type} gross worldwide?`
      };
      question = `How much did ${fullTitle} gross worldwide?`;
      answer = `${capitalizeFirstLetter(
        fullTitle
      )} grossed ${gross} worldwide.`;
      break;
    case "Director":
      questions = {
        p: `Who ${tense('directs')} it?`,
        e: `Who ${tense('directs')} the ${type}?`
      };
      question = `Who ${tense('directs')} ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} directed by ${chain(imdb['Director'])}.`;
      break;
    case "Directors":
      questions = {
        p: `Who ${tense('directs')} it?`,
        e: `Who ${tense('directs')} the ${type}?`
      };
      question = `Who ${tense('directs')} ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} directed by ${chain(imdb['Directors'])}.`;
      break;
    case "Filming Locations":
      questions = {
        p: `Where ${tense('is')} it filmed?`,
        e: `Where ${tense('is')} the ${type} filmed?`
      }
      question = `Where ${tense('is')} ${fullTitle} filmed?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} filmed in ${formatLocation(chain(imdb['Filming Locations']), false)}.`;
      break;
    case "Genre":
      var genres = imdb['Genre'];
      questions = {
        p: `What genre is it?`,
        e: `What genre is the ${type}?`
      }
      question = `What genre is ${fullTitle}?`;
      answer = `The ${genres.length > 1 ? "genres" : "genre"} of ${fullTitle} ${genres.length > 1 ? "are" : "is"} ${chain(genres)}.`;
      break;
      break;
    case "Gross USA":
      break;
    case "Language":
      break;
    case "Motion Picture Rating (MPAA)":
      questions = {
        p: `What is its movie rating?`,
        e: `Where is the ${type}${possessive} movie rating?`
      }
      question = `What is ${fullTitle}${possessiveTitle} movie rating?`;
      answer = `${capitalizeFirstLetter(fullTitle)} is rated ${chain(imdb['Motion Picture Rating (MPAA)'].hasOwnProperty('Detailed') ? imdb['Motion Picture Rating (MPAA)'].Detailed : imdb['Motion Picture Rating (MPAA)'].Short )}.`;
      break;
    case "Opening Weekend USA":
      break;
    case "Original Title":
      break;
    case "Plot":
      questions = {
        p: `What is its plot?`,
        e: `What is the ${type}${possessive} plot?`
      };
      question = `What is ${fullTitle}${possessiveTitle} plot?`;
      answer = `${chain(imdb['Plot'])}`;
      break;
    case "Production Co":
      questions = {
        p: `What company produced it?`,
        e: `What company produced the ${type}?`
      };
      question = `What company produced ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} was produced by ${chain(imdb['Production Co'])}.`;
      break;
    case "Rating":
      questions = {
        p: `What is its IMDb User Rating?`,
        e: `What is the ${type}${possessive} IMDb User Rating?`
      };
      question = `What is ${fullTitle}${possessiveTitle} IMDb User Rating?`;
      answer = `${chain(imdb['Rating']['No. of Users'])} IMDb users have given a weighted average vote of ${chain(imdb['Rating']['Average Rating']).replace('/', 'out of')} for ${fullTitle}.`;
      break;
    case "Release Date":
      var ftCheckQ = imdb['Release Date'][0].includes('2021') ? 'is' : 'was';
      var ftCheckA = imdb['Release Date'][0].includes('2021') ? 'will be' : 'was';
      questions = {
        p: `When ${ftCheckQ} its release date?`,
        e: `When ${ftCheckQ} the ${type}${possessive} release date?`
      };
      question = `What ${ftCheckQ} ${fullTitle}${possessiveTitle} release date?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${ftCheckA} released ${formatReleaseDate(chain(imdb['Release Date']))}.`;
      break;
    case "RuntimeM":
      break;
    case "RuntimeHM":
      questions = {
        p: `What is its runtime?`,
        e: `What is the ${type}${possessive} runtime?`
      };
      question = `What is ${fullTitle}${possessiveTitle} runtime?`;
      answer = `${capitalizeFirstLetter(fullTitle)}${possessiveTitle} runtime is ${formatRunTime(chain(imdb['RuntimeHM']))}.`;
      break;
    case "Sound Mix":
      break;
    case "Stars":
      questions = {
        p: `Who ${tense('stars')} in it?`,
        e: `Who ${tense('stars')} in the ${type}?`
      };
      question = `Who ${tense('stars')} in ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} stars ${chain(imdb['Stars'])}.`;
      break;
    case "Storyline":
      break;
    case "Title":
      // Default element
      break;
    case "Type":
      break;
      // Default element
    case "URL":
      // Default element
      break;
    case "Writer":
      questions = {
        p: `Who wrote it?`,
        e: `Who wrote the ${type}?`
      };
      question = `Who wrote ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} written by ${chain(imdb['Writer'])}.`;
      break;
    case "Writers":
      questions = {
        p: `Who wrote it?`,
        e: `Who wrote the ${type}?`
      };
      question = `Who wrote ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} written by ${chain(imdb['Writers'])}.`;
      break;
    default:
      console.error(`${key} has not been accounted for in this version.`);
  }

  if (questions && question && answer && source) {
    if (mcmode) {
      var obj = {}
      for (qKey in questions) {
        obj[qKey] = [questions[qKey], question, answer, key === 'Rating' ? source + '/ratings?ref_=tt_ov_rt' : source].join("\t");
        // obj[qKey] = [questions[qKey], key === 'Rating' ? source + '/ratings?ref_=tt_ov_rt' : source].join("\t");
      }
      lines.push(obj);
    } else {
      lines.push([question, answer, key === 'Rating' ? source + '/ratings?ref_=tt_ov_rt' : source].join("\t"))
    }
  }
}

function shuffleArray(array) {
  for(let i = array.length-1; i > 0; i--) {
    var j = Math.floor(Math.random() * i)
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}

// shuffleArray(lines)

var output = []

  lines.forEach(arr => {
    if (mcmode) {
      for (line in arr) {
        output.push(arr[line])
      }
    } else {
      output.push(arr)
    }
  })



console.log(output.join("\n"));

