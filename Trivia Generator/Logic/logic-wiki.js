clear()

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
    case pLow.includes("anime"):
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
  var title = media.title.flipped ? `the ${media.title.flipped}` : media.title.normal;
  var possessive = title[title.length-1] === 's' ? '\'s' : '\'s';
  var source = media.source;
  var questions = undefined;
  var question = undefined;
  var answer = undefined;
  var line = [];
  var isPresent;
  var type = media.type;

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
      "directs": 'directed'
    };
    return isPresent ? string : past[string];
  }

  questions = {};
  question = undefined;
  answer = undefined;

  switch(key) {
    case "Based on":
      questions = {
        p: `What is it based on?`,
        e: `What is the ${type} based on?`
      }
      question = `What ${tense('is')} ${title} based on?`;
      answer = `${capitalizeFirstLetter(title)} ${tense('is')} based on ${chainAnswer(infobox[key])}.`
      break;
    case "Box office":
      questions = {
        p: `How much did it make at the box office?`,
        e: `How much did the ${type} make at the box office?`
      }
      question = `How did ${title} do at the box office?`;
      answer = `${capitalizeFirstLetter(title)} earned ${chainAnswer(infobox[key])} at the box office.`
      break;
    case "Budget":
      questions = {
        p: `What was its budget?`,
        e: `What was the ${type} budget?`
      }
      question = `What ${tense('is')} the budget of ${title}?`;
      answer = `The budget of ${title} ${tense('is')} ${chainAnswer(infobox[key])}.`
      break;
    // case "Cantonese":
      
    //   break;
    // case "Chinese":
      
    //   break;
    case "Cinematography":
      questions = {
        p: `Who was its cinematography by?`,
        e: `Who was the types cinematography by?`
      }
      question = `Who ${tense('is')} the cinematography for ${title} by?`
      answer = `The cinematography for ${title} ${tense('is')} by ${chainAnswer(infobox[key])}.`
      break;
    case "Composer":
      questions = {
        p: `Who composed its music?`,
        e: `Who compsed the types music?`
      }
      question = `Who ${tense('is')} the composer for ${title} by?`
      answer = `The composer for ${title} ${tense('is')} ${chainAnswer(infobox[key])}.`
      break;
    case "Country":
      questions = {
        p: `What is its country of origin?`,
        e: `What is the ${type} country of origin?`
      }
      question = `What is the country of ${title}?`;
      answer = `The country of ${title} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Country of origin":
      questions = {
        p: `What is its country of origin?`,
        e: `What is the ${type} country of origin?`
      }
      question = `What is ${title}${possessive} country of origin?`;
      answer = `${capitalizeFirstLetter(title)}${possessive} country of origin is ${chainAnswer(infobox[key])}.`;
      break;
    case "Created by":
      questions = {
        p: `Who was it created by?`,
        e: `Who was the ${type} created by?`
      }
      question = `Who ${tense('is')} ${title} created by?`;
      answer = `${capitalizeFirstLetter(title)} ${tense('is')} created by ${chainAnswer(infobox[key])}.`;
      break;
    case "Directed by":
      questions = {
        p: `Who was it directed by?`,
        e: `Who was the ${type} created by?`
      }
      question = `Who directed ${title}?`;
      answer = `${capitalizeFirstLetter(title)} ${tense('is')} directed by ${chainAnswer(infobox[key])}.`;
      break;
    case "Distributed by":
      questions = {
        p: `What company was it distributed by?`,
        e: `Waht company was the type distributed by?`
      }
      question = `Who distributed ${title}?`;
      answer = `${capitalizeFirstLetter(title)} ${tense('is')} distributed by ${chainAnswer(infobox[key])}.`;
      break;
    case "Distributor":
      questions = {
        p: `Who distributed it?`,
        e: `Who distributed the ${type}?`
      }
      question = `Who is the distributor for ${title}?`;
      answer = `The distributor for${title} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Edited by":
      questions = {
        p: `Who edited it?`,
        e: `Who edited the ${type}?`
      }
      question = `Who edited ${title}?`;
      answer = `${capitalizeFirstLetter(title)} ${tense('is')} edited by ${chainAnswer(infobox[key])}.`;
      break;
    case "Editor":
      questions = {
        p: `Who edited it?`,
        e: `Who edited the ${type}?`
      }
      question = `Who ${tense('is')} the editor for ${title}?`;
      answer = `The editor for ${title} ${tense('is')} ${chainAnswer(infobox[key])}.`;
      break;
    // case "English network":
      
    //   break;
    // case "Episodes":
      
    //   break;
    case "Executive producer":
      questions = {
        p: `Who was the executive producer for it?`,
        e: `Who was the executive producer for the ${type}?`
      }
      question = `Who ${tense('is')} the executive producer for ${title}?`;
      answer = `The executive producer for ${title} ${tense('is')} by ${chainAnswer(infobox[key])}.`;
      break;
    case "Genre":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `What is the genre of ${title}?`;
      answer = `The genre of ${title} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Language":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `What is the language of ${title}?`;
      answer = `The language of ${title} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Licensed by":
      
      break;
    case "Music by":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `Who ${tense('is')} the music for ${title} by?`;
      answer = `The music for ${title} ${tense('is')} by ${chainAnswer(infobox[key])}.`;
      break;
    case "No. of episodes":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `How many episodes does ${title} have?`;
      answer = `The number of episodes for ${title} is ${chainAnswer(infobox[key])}.`;
      break;
    case "No. of seasons":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `How many seasons does ${title} have?`;
      answer = `The number of seasons for ${title} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Opening theme":
      
      break;
    case "Original language":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `What was ${title}${possessive} original language?`;
      answer = `${capitalizeFirstLetter(title)}${possessive} original language was ${chainAnswer(infobox[key])}.`;
      break;
    case "Original network":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `What network was ${title} originally on?`;
      answer = `${title}${possessive} was originally on ${chainAnswer(infobox[key])}.`;
      break;
    case "Original release":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `When was ${title} released?`;
      answer = `${capitalizeFirstLetter(title)} was released ${isPresent ? infobox[key].join(" ").replace("–", "to the") : infobox[key].join(" ").replace("–", "to")}.`;
      break;
    case "Original run":
      
      break;
    case "Preceded by":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `What series was ${title} preceded by?`;
      answer = `${capitalizeFirstLetter(title)}${possessive} was preceded by ${chainAnswer(infobox[key])}.`;
      break;
    case "Produced by":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `Who produced ${title}?`;
      answer = `${capitalizeFirstLetter(title)} ${tense('is')} produced by ${chainAnswer(infobox[key])}.`;
      break;
    case "Producer":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `Who ${tense('is')} the producer for ${title}?`;
      answer = `The producer for ${capitalizeFirstLetter(title)} ${tense('is')} ${chainAnswer(infobox[key])}.`;
      break;
    case "Production companies":
      lines.push(
        `What company produced ${the}${title}?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} was produced by ${chainAnswer(answer)}.\t${source}`
      );
      break;
    case "Production company":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `What company produced ${title}?`;
      answer = `${capitalizeFirstLetter(title)} ${tense('is')} produced by ${chainAnswer(infobox[key])}.`;
      break;
    case "Production location":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `Where ${tense('is')} ${title} produced?`;
      answer = `${capitalizeFirstLetter(title)} ${tense('is')} produced in ${chainAnswer(infobox[key])}.`;
      break;
    case "Related shows":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `What is a show that's related to ${title}?`;
      answer = `${capitalizeFirstLetter(title)} is related to the ${chainAnswer(infobox[key])}.`;
      break;
    case "Release date":
      questions = {
        p: `?`,
        e: `?`
      }
      question = `When was ${title} released?`;
      answer = `${capitalizeFirstLetter(title)} was released on ${chainAnswer(infobox[key])}.`;
      break;
    case "Running time":
      questions = {
        p: `What is its running time?`,
        e: `What is the ${type} running time?`
      }
      question = `What is the running time of ${title}?`;
      answer = `The running time of ${title} is ${chainAnswer(infobox[key])}.`;
      break;
    case "Screenplay by":
      
      break;
    case "Starring":
      questions = {
        p: `Who starred in it?`,
        e: `Who starred in the ${type}?`
      }
      question = `Who starred in ${title}?`;
      answer = `${capitalizeFirstLetter(title)} stars ${chainAnswer(infobox[key])}.`;
      break;
    case "Studio":
      
      break;
    case "Written by":
      questions = {
        p: `Who wrote it?`,
        e: `Who wrote the ${type}?`
      }
      question = `Who wrote ${title}?`;
      answer = `${capitalizeFirstLetter(title)} ${tense('is')} written by ${chainAnswer(infobox[key])}.`;
      break;
    default:
      console.log(`Error:\t${key} is unaccounted for.\tSend help!`)
  }

    if (questions && question && answer && source) {
      var obj = {};
      for (qKey in questions) {
        obj[qKey] = [questions[qKey], question, answer, source].join("\t");

      }
      lines.push(obj)
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
  for (line in arr) {
    output.push(arr[line])
  }
})

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


