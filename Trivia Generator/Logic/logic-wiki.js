console.clear()

var mcmode = true;

// Data

var media = {
  source: undefined,
  title: {
    flipped: undefined,
    normal: undefined,
    stripped: undefined,
  },
  type: undefined,
  infobox: {},
  pluralCountries: {
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
  },
  keyterms: [
    "star",
    "direct",
    "budget",
    "gross",
    "minutes",
    "hours",
    "time",
    "release",
    "based",
    "soundtrack",
    "running time",
    "Rotten Tomatoes",
  ],
};

// Capture the URL of the source page.
media.source = window.location.href;

// Determine the media type by finding the intro paragraph relative to the infobox.

function revealMediaType(p) {
  var pLow = p.toLowerCase();
  switch (true) {
    case pLow.includes("anime") || pLow.includes("manga"):
      return "anime";
      break;
    case pLow.includes("television series") ||
      (pLow.includes("television") && pLow.includes("drama")):
      return "television series";
      break;
    case pLow.includes("film"):
      return "film";
      break;
  }
}

var introParagraph = document.querySelector(".infobox").nextElementSibling
  .textContent;
media.type = revealMediaType(introParagraph);

// Capture the media title and format if applicable.

function formatTitle(t) {
  var temp;
  // QUICK FIX NEEDS EDITING.
  if (t.includes("TV")) {
    temp = t.replace("TV", "television");
    media.title.normal = temp;
  } else {
    media.title.normal = t;
  }
  if (t.includes("(")) {
    temp = t
      .replace("TV", "television")
      .replace(/[())]/g, " ")
      .trim()
      .split(/[\s]{2,}/);
    var [head, tail] = temp;
    media.title.flipped = [tail, head].join(" ");
  }
  media.title.stripped = t.replace("TV", "television").replace(/[()]/g, "");
}

formatTitle(document.querySelector("#firstHeading").textContent);

// Capture Year

media.year = document.querySelector('#catlinks').innerText.match(/\d{4,}/)[0];

// Scrape infobox

function chainData(array) {
  // TODO
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

function chainAnswer(array) {
  // TODO
  var length = array.length;
  if (length === 0) {
    return "";
  } else if (length === 1) {
    return `${array[0]}`;
  } else if (length === 2) {
    return `${array[0]}, and ${array[1]}`;
  } else {
    return `${array.splice(0, array.length - 1).join(", ")}, and ${
      array[array.length - 1]
    }`;
  }
}

function chainTensedAnswer(array) {
  // TODO
  var length = array.length;
  if (length === 0) {
    return "";
  } else if (length === 1) {
    return `${array[0]}`;
  } else if (length === 2) {
    return `${array[0]}, and ${array[1]}`;
  } else {
    return `${array.splice(0, array.length - 1).join(", ")} and now ${
      array[array.length - 1]
    }`;
  }
}

function splitBy(array) {
  var temp = [];
  var n = 0;
  for (let i = 0; i < array.length - 1; i++) {
    temp[n] = temp[n] ? (temp[n] += `\n${array[i]}`) : array[i];
    if (array[i + 2] && array[i + 2].includes("by ")) {
      n += 1;
    }
  }
  return temp.map((item) => {
    var [book, author] = item.split("by ");
    return [book.trim(), chainData(author.trim().split(/\n/))].join(" by ");
  });
}

var first = (first = document.querySelector(
  ".infobox > tbody > tr:nth-child(1)"
));
var el = first;
var pulledInfobox = [];

while (el !== null) {
  pulledInfobox.push(el);
  el = el.nextElementSibling;
}

pulledInfobox.forEach((info) => {
  if (info.childElementCount == 2) {
    var exclude = ["Based on"];
    var key = info.children[0].innerText.replace(/\(([a-z ]){1,}\)/gi, "").replace(/\s/g, " ");
    var value = info.children[1].innerText.replace(/\[\d{1,3}\]/gi, "");
    media.infobox[key] = exclude.includes(key) ? value : value.split(/\n/);
  }
});

// If 'Based on' exists, format it.

if (media.infobox.hasOwnProperty("Based on")) {
  if (
    media.infobox["Based on"].split(/\s/).filter((x) => x.includes("by"))
      .length > 1
  ) {
    media.infobox["Based on"] = splitBy(media.infobox["Based on"].split(/\n/));
  } else {
    var [book, author] = media.infobox["Based on"].split("by ");
    media.infobox["Based on"] = [[
      book.trim(),
      chainData(author.trim().split(/\n/)),
    ].join(" by ")];
  }
}
// console.log(media);
// console.log(media.infobox)

//
// var obj = {};

// rows.forEach((x) => {
//   var temp = x.children[1].innerText;
//   if (temp.includes("[")) {
//     temp = `${temp.slice(0, temp.indexOf("["))}`;
//   }
//   obj[x.children[0].textContent] = temp;
// });

var lines = [];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

for (key in media.infobox) {
  var infobox = media.infobox;
  var title = media.title.flipped ? media.title.flipped : media.title.normal;
  var possessive = title[title.length-1] === 's' ? '\'s' : '\'s';
  var source = media.source;
  var questions = undefined;
  var question = undefined;
  var answer = undefined;
  var line = [];
  var isPresent;
  var type = media.type;
  var possessiveType = type[type.length-1] == 's' ? '\'s' : '\'s';
  var year = media.year;
  var fullTitle = `the ${year} ${media.title.flipped ? '' : type} ${title}`.replace('  ', ' ');
  var pluralItems = undefined;

  function presenceCheck(keyToCheck) {
    return infobox[keyToCheck].join(" " ).toLowerCase(). includes('present');
  }
  
  switch(true) {
    case media.type === 'film':
      isPresent = false;
      break;
    case infobox.hasOwnProperty('Original release'):
      isPresent = presenceCheck('Original release');
      break;
    case infobox.hasOwnProperty('Original run'):
      isPresent = presenceCheck('Original run');
      break;
    default:
      isPresent = infobox[key].join(" " ).toLowerCase().includes('present')
  }
  
  
  infobox[key].join(" ").toLowerCase().includes('present') && media.type !== 'film';

  function tense(string) {
    var past = {
      "is": "was",
      "stars": "starred",
      "directs": 'directed',
      "composes": "composed"
    };
    return isPresent ? string : past[string];
  }

  questions = {};
  question = undefined;
  answer = undefined;

  switch(key) {
    case "Audio format":
      questions = {
        p: `What audio format is it in?`,
        e: `What audio format is the ${type} in?`
      }
      question = `What audio format is ${fullTitle} in?`;
      answer = `The audio format for ${fullTitle} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Based on":
      questions = {
        p: `What ${tense('is')} it based on?`,
        e: `What ${tense('is')} the ${type} based on?`
      }
      question = `What ${tense('is')} ${fullTitle} based on?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} based on ${chainAnswer(infobox[key])}.`
      break;
    case "Box office":
      questions = {
        p: `How much did it make at the box office?`,
        e: `How much did the ${type} make at the box office?`
      }
      question = `How much did ${fullTitle} make at the box office?`;
      answer = `${capitalizeFirstLetter(fullTitle)} grossed ${chainAnswer(infobox[key])} at the box office.`
      break;
    case "Budget":
      questions = {
        p: `What ${tense('is')} its budget?`,
        e: `What ${tense('is')} the ${type}${possessiveType} budget?`
      }
      question = `What ${tense('is')} ${fullTitle}${possessive} budget?`;
      answer = `The budget of ${fullTitle} ${tense('is')} ${chainAnswer(infobox[key])}.`
      break;
    case "Cantonese":
      // Skipped
      break;
    case "Chinese":
      // Skipped
      break;
    case "Cinematography":
      questions = {
        p: `Who ${tense('is')} its cinematography by?`,
        e: `Who ${tense('is')} the ${type}${possessiveType} cinematography by?`
      }
      question = `Who ${tense('is')} ${fullTitle}${possessive} by?`
      answer = `The cinematography for ${fullTitle} ${tense('is')} by ${chainAnswer(infobox[key])}.`
      break;
    case "Composer":
      questions = {
        p: `Who ${tense('composes')} its music?`,
        e: `Who ${tense('composes')} the ${type}${possessiveType} music?`
      }
      question = `Who ${tense('composes')} ${fullTitle}${possessive} music?`
      answer = `${capitalizeFirstLetter(fullTitle)}${possessive} music ${tense('is')} composed by ${chainAnswer(infobox[key])}.`
      break;
    case "Country":
      questions = {
        p: `What country is it from?`,
        e: `What country is the ${type} from?`
      }
      question = `What country is ${fullTitle} from?`;
      answer = `The country of ${fullTitle} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Country of origin":
      questions = {
        p: `What is its country of origin?`,
        e: `What is the ${type}${possessiveType} country of origin?`
      }
      question = `What is ${fullTitle}${possessive} country of origin?`;
      answer = `${capitalizeFirstLetter(fullTitle)}${possessive} country of origin is ${chainAnswer(infobox[key])}.`;
      break;
    case "Created by":
      questions = {
        p: `Who ${tense('is')} it created by?`,
        e: `Who ${tense('is')} the ${type} created by?`
      }
      question = `Who ${tense('is')} ${fullTitle} created by?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} created by ${chainAnswer(infobox[key])}.`;
      break;
    case "Directed by":
      questions = {
        p: `Who ${tense('directs')} it?`,
        e: `Who ${tense('directs')} the ${type}?`
      }
      question = `Who ${tense('directs')} ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} directed by ${chainAnswer(infobox[key])}.`;
      break;
    case "Distributed by":
      questions = {
        p: `What company was it distributed by?`,
        e: `What company was the ${type} distributed by?`
      }
      question = `What company was ${fullTitle} distributed by?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} distributed by ${chainAnswer(infobox[key])}.`;
      break;
    case "Distributor":
      questions = {
        p: `Who was its distributor?`,
        e: `Who was the ${type}${possessiveType} distributor?`
      }
      question = `Who was ${fullTitle}${possessive} distributor?`;
      answer = `The distributor for${fullTitle} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Edited by":
      questions = {
        p: `Who edited it?`,
        e: `Who edited the ${type}?`
      }
      question = `Who edited ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} edited by ${chainAnswer(infobox[key])}.`;
      break;
    case "Editor":
      questions = {
        p: `Who ${tense('is')} the editor for it?`,
        e: `Who ${tense('is')} the editor for the ${type}?`
      }
      question = `Who ${tense('is')} the editor for ${fullTitle}?`;
      answer = `The editor for ${fullTitle} ${tense('is')} ${chainAnswer(infobox[key])}.`;
      break;
    case "English network":
      // Skipped
      break;
    case "Episodes":
      questions = {
        p: `How many episodes does it have?`,
        e: `How many episodes does the ${type} have?`
      }
      question = `How many episodes does ${fullTitle} have?`
      answer = `${capitalizeFirstLetter(fullTitle)} has ${chainAnswer(infobox[key])} episodes.`
      break;
    case "Executive producer":
      questions = {
        p: `Who ${tense('is')} the executive producer for it?`,
        e: `Who ${tense('is')} the executive producer for the ${type}?`
      }
      question = `Who ${tense('is')} the executive producer for ${fullTitle}?`;
      answer = `The executive producer for ${fullTitle} ${tense('is')} by ${chainAnswer(infobox[key])}.`;
      break;
    case "Followed by":
      questions = {
        p: `What was it followed by?`,
        e: `What was the ${type} followed by?`
      }
      question = `What was ${fullTitle} followed by?`;
      answer = `${capitalizeFirstLetter(fullTitle)} was followed by ${chainAnswer(infobox[key])}.`
      break;
    case "Genre":
      questions = {
        p: `What is its genre?`,
        e: `What is the ${type}${possessiveType} genre?`
      }
      question = `What is ${fullTitle}${possessive} genre?`;
      isPlural = infobox[key].length > 1;
      answer = `The ${isPlural ? 'genres': 'genre'} of ${fullTitle} ${isPlural ? 'are' : 'is'} ${chainAnswer(infobox[key])}.`;
      break;
    case "Language":
      questions = {
        p: `What language is it in?`,
        e: `What language is the ${type} in?`
      }
      question = `What language is ${fullTitle} in?`;
      answer = `The language of ${fullTitle} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Licensed by":
      
      break;
    case "Music by":
      questions = {
        p: `Who ${tense('is')} its music by?`,
        e: `Who ${tense('is')} the ${type}${possessiveType} music by?`
      }
      question = `Who ${tense('is')} ${fullTitle}${possessive} msuic by?`;
      answer = `The music for ${fullTitle} ${tense('is')} by ${chainAnswer(infobox[key])}.`;
      break;
    case "No. of episodes":
      questions = {
        p: `How many episodes does it have?`,
        e: `How many episodes does the ${type} have?`
      }
      question = `How many episodes does ${fullTitle} have?`;
      answer = `The number of episodes for ${fullTitle} is ${chainAnswer(infobox[key])}.`;
      break;
    case "No. of seasons":
      questions = {
        p: `How many seasons does it have?`,
        e: `How many seasons does the ${type} have?`
      }
      question = `How many seasons does ${fullTitle} have?`;
      answer = `The number of seasons for ${fullTitle} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Opening theme":
      questions = {
        p: `What is its opening theme?`,
        e: `What is the ${type}${possessiveType} opening theme?`
      }
      question = `What is ${fullTitle}${possessive} opening theme?`;
      answer = `The opening theme for ${fullTitle} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Original language":
      questions = {
        p: `What language is it?`,
        e: `What language is the ${type}?`
      }
      question = `What language is ${fullTitle}?`;
      answer = `The language of ${fullTitle} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Original network":
      questions = {
        p: `What network was it on?`,
        e: `What network was the ${type} on?`
      }
      question = `What network was ${fullTitle} on?`;
      answer = `${capitalizeFirstLetter(fullTitle)}$ was on ${chainAnswer(infobox[key])}.`;
      break;
    case "Original release":
      questions = {
        p: `When was it released?`,
        e: `When was the ${type} released?`
      }
      question = `When was ${fullTitle} released?`;
      answer = `${capitalizeFirstLetter(fullTitle)} was released ${isPresent ? infobox[key].join(" ").replace("–", " to the ") : infobox[key].join(" ").replace("–", " to ")}.`;
      break;
    case "Original run":
      questions = {
        p: `When was its original run?`,
        e: `When was the ${type}${possessiveType} original run?`
      }
      question = `When was ${fullTitle}${possessive} original run?`
      answer = `The original run of ${fullTitle} was from ${isPresent ? infobox[key].join(" ").replace("–", " to the ") : infobox[key].join(" ").replace("–", " to ")}.`;
      break;
    case "Preceded by":
      questions = {
        p: `What was it preceded by?`,
        e: `What was the ${type} preceded by?`
      }
      question = `What was ${fullTitle} preceded by?`;
      answer = `${capitalizeFirstLetter(fullTitle)} was preceded by ${chainAnswer(infobox[key])}.`;
      break;
    case "Picture format":
      questions = {
        p: `What is its picture format?`,
        e: `What is the ${type}${possessiveType} picture format?`
      }
      question = `What is ${fullTitle}${possessive} picture format?`
      answer = `The picture format for ${fullTitle} is ${chainAnswer(infobox[key])}.`
      break;
    case "Produced by":
      questions = {
        p: `Who produced it?`,
        e: `Who produced the ${type}?`
      }
      question = `Who produced ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(title)} ${tense('is')} produced by ${chainAnswer(infobox[key])}.`;
      break;
    case "Producer":
      questions = {
        p: `Who produced it?`,
        e: `Who produced the ${type}?`
      }
      question = `Who produced ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} produced by ${chainAnswer(infobox[key])}.`;
      break;
    case "Production companies":
      questions = {
        p: `What company produced it?`,
        e: `What company produced the ${type}?`
      }
      question = `What company produced ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} produced by ${chainAnswer(infobox[key])}.`
      break;
    case "Production company":
      questions = {
        p: `What company produced it?`,
        e: `What company produced the ${type}?`
      }
      question = `What company produced ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} produced by ${chainAnswer(infobox[key])}.`;
      break;
    case "Production location":
      questions = {
        p: `Where was it produced?`,
        e: `Where was the ${type} produced?`
      }
      question = `Where was ${fullTitle} produced?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} produced in ${chainAnswer(infobox[key])}.`;
      break;
    case "Related shows":
      questions = {
        p: `What shows are related to it?`,
        e: `What shows are related to the ${type}?`
      }
      question = `What show are related to ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} is related to the ${chainAnswer(infobox[key])}.`;
      break;
    case "Release date":
      questions = {
        p: `When was it released?`,
        e: `When was the ${type} released?`
      }
      question = `When was ${fullTitle} released?`;
      answer = `${capitalizeFirstLetter(fullTitle)} was released on ${chainAnswer(infobox[key])}.`;
      break;
    case "Running time":
      questions = {
        p: `What is its running time?`,
        e: `What is the ${type}${possessiveType} running time?`
      }
      question = `What is the running time of ${fullTitle}?`;
      answer = `The running time of ${fullTitle} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Screenplay by":
      questions = {
        p: `Who wrote its screenplay?`,
        e: `Who wrote the ${type}${possessiveType} screenplay?`
      }
      question = `Who wrote ${fullTitle}${possessive} screenplay?`;
      answer = `The screenplay for ${fullTitle} was written by ${chainAnswer(infobox[key])}.`;
      break;
    case "Starring":
      questions = {
        p: `Who starred in it?`,
        e: `Who starred in the ${type}?`
      }
      question = `Who starred in ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} stars ${chainAnswer(infobox[key])}.`;
      break;
    case "Studio":
      questions = {
        p: `What studio worked on it?`,
        e: `What studio worked on the ${type}?`
      }
      question = `What studio worked on ${fullTitle}?`
      answer = `${capitalizeFirstLetter(fullTitle)} was animated by ${chainAnswer(infokey[key])}.`
      break;
    case "Written by":
      questions = {
        p: `Who wrote it?`,
        e: `Who wrote the ${type}?`
      }
      question = `Who wrote ${fullTitle}?`;
      answer = `${capitalizeFirstLetter(fullTitle)} ${tense('is')} written by ${chainAnswer(infobox[key])}.`;
      break;
    default:
      console.log(`Error:\t${key} is unaccounted for.\tSend help!`)
  }

    if (questions && question && answer && source) {
      if (mcmode) {
        var obj = {};
        for (qKey in questions) {
          obj[qKey] = [questions[qKey], question, answer, source].join("\t");

        }
        lines.push(obj)
      } else {
        lines.push([question, answer, source].join("\t"));
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

var output = [];

lines.forEach(arr => {
  if (mcmode) {
    for (line in arr) {
      output.push(arr[line])
    }
  } else {
    output.push(arr)
  }
})

// console.log(media);

console.log(output.join("\n"));

// Points of interest

// var raw = [...document.querySelectorAll("p")];
// var interests = [];
// var filinterests = [];

// raw.forEach((x) => {
//   // interests = interests.concat(` ${x.textContent}`.match(/\s+[^.]*[.]/gi))
//   interests = interests.concat(` ${x.textContent}`.split(/(?<!\..)[.?!]\s+/gi));
//   // interests = interests.concat(` ${x.textContent}`.replace(/\s[a-z]{1,2}\./, ).replace(/\[\d{1,2}\]/gi, '').replace(/\s{2}/, " ").split(/(?<!\..)[.?!]\s+/gi).map(x=> `${x.trim()}.`).filter(x => x.split(' ').length < 30))
// });

// interests = interests.filter((x) => x.trim()).map((x) => `${x.trim()}.`);

// var n = 0;
// var clean = [];

// while (n < interests.length) {
//   if (interests[n].match(/\s[a-z]{1,2}\./gi)) {
//     clean.push(`${interests[n]} ${interests[n + 1]}`);
//     n += 2;
//   } else {
//     clean.push(interests[n]);
//     n += 1;
//   }
// }

// clean.forEach((x) => {
//   media.keyterms.forEach((y) => {
//     if (x.includes(y)) {
//       filinterests.push(x);
//     }
//   });
// });

// console.log(
//   [...new Set(filinterests)]
//     .filter((x) => x.split(" ").length < 30)
//     .map((x) => x.replace(/\[\d{1,2}\]/gi, ""))
// );


