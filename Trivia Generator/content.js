console.clear();
console.log("Browser extension running");

var mcmode = false;
var clipboard;

handleStrip = (string) => {
  let isWriting = true;
  let isQuoting = false;
  let hasClosed = true;
  let stripped = "";
  let isReferencing = false;

  // no-plusplus
  for (let i = 0; i < string.length; i += 1) {
    const pText = string[i + 1] === "(";

    if (string[i] === "[" && !isQuoting) {
      isWriting = false;
      hasClosed = false;
      isReferencing = true;
    }
    // removes embedded (<url>)
    if (pText) {
      isWriting = false;
      hasClosed = false;
    }
    if (string[i] === ")") {
      hasClosed = true;
    }
    if (string[i] === '"') {
      isQuoting = !isQuoting;
    }
    if (string[i] === "]") {
      hasClosed = true;
      if (string[i + 1] !== ":") {
        isReferencing = false;
      }
    }
    if (string[i + 1] === " " && isReferencing) {
      isReferencing = !isReferencing;
    }
    if (
      (string[i].match(/\s/) ||
        string[i] === "," ||
        string[i] === "." ||
        string[i] === "!" ||
        string[i] === ";" ||
        string[i] === ":" ||
        string[i] === '"' ||
        string[i] === "?") &&
      hasClosed &&
      !isReferencing
    ) {
      isWriting = true;
    }
    if (isWriting) {
      stripped += string[i];
    }
  }
  return stripped;
};

//*******************************//
//                               //
//          Wikipedia            //
//                               //
//*******************************//

const wmc = () => {
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
        ((pLow.includes("television") ||
          pLow.includes("drama") ||
          document
            .querySelector("#catlinks")
            .innerText.includes("television")) &&
          !document.querySelector("#catlinks").innerText.includes("film")):
        return "television series";
        break;
      case pLow.includes("film"):
        return "film";
        break;
    }
  }

  // Capture Rotten Tomatoes

  var raw = [...document.querySelectorAll("p")].map(
    (paragraph) => handleStrip(paragraph.textContent.trim())
  );
  if (
    raw.filter((contents) => contents.includes("Rotten Tomatoes")).length > 0
  ) {
    media.infobox["Rotten Tomatoes"] = [
      `${raw
          .filter((contents) => contents.includes("Rotten Tomatoes"))[0]
          .split(". ")
          .filter((x) => x.includes("Rotten Tomatoes"))[0]}.`,
    ];
  }

  // Checks for no infobox
  var introParagraph = document.querySelector(".infobox")
    ? document.querySelector(".infobox").nextElementSibling.textContent
    : document.querySelector("div.mw-parser-output > p:nth-child(2)")
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

  media.year = document.querySelector("#catlinks").innerText.match(/\d{4,}/)[0];

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
    for (let i = 0; i < array.length; i++) {
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
      var key = info.children[0].innerText
        .replace(/\(([a-z ]){1,}\)/gi, "")
        .replace(/\s/g, " ");
      var value = info.children[1].innerText.replace(/\[\d{1,3}\]/gi, "");
      media.infobox[key] = exclude.includes(key) ? value : value.split(/\n/);
    }
  });

  // If 'Based on' exists, format it.

  if (media.infobox.hasOwnProperty("Based on")) {
    if (media.infobox["Based on"].includes("by")) {
      if (
        media.infobox["Based on"].split(/\s/).filter((x) => x.includes("by"))
          .length > 1
      ) {
        media.infobox["Based on"] = splitBy(
          media.infobox["Based on"].split(/\n/)
        );
      } else {
        var [book, author] = media.infobox["Based on"].split(/by |by/);
        media.infobox["Based on"] = [
          [book.trim(), chainData(author.trim().split(/\n/))].join(" by "),
        ];
      }
    } else {
      media.infobox["Based on"] = [media.infobox["Based on"]];
    }
  }

  var lines = [];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  for (key in media.infobox) {
    var infobox = media.infobox;
    var title = media.title.flipped ? media.title.flipped : media.title.normal;
    var possessive = title[title.length - 1] === "s" ? "'" : "'s";
    var source = media.source;
    var questions = undefined;
    var question = undefined;
    var answer = undefined;
    var line = [];
    var isPresent;
    var type = media.type;
    var possessiveType = type[type.length - 1] == "s" ? "'" : "'s";
    var year = media.year;
    var fullTitle = `the ${
      media.title.normal.match(/\(\d{4}/) ? "" : year + " "
    }${media.title.flipped ? "" : type} ${title}`.replace("  ", " ");
    var pluralItems = undefined;

    function presenceCheck(keyToCheck) {
      return infobox[keyToCheck].join(" ").toLowerCase().includes("present");
    }

    switch (true) {
      case media.type === "film":
        isPresent = false;
        break;
      case infobox.hasOwnProperty("Original release"):
        isPresent = presenceCheck("Original release");
        break;
      case infobox.hasOwnProperty("Original run"):
        isPresent = presenceCheck("Original run");
        break;
      default:
        isPresent = infobox[key].join(" ").toLowerCase().includes("present");
    }

    infobox[key].join(" ").toLowerCase().includes("present") &&
      media.type !== "film";

    function tense(string) {
      var past = {
        is: "was",
        stars: "starred",
        directs: "directed",
        composes: "composed",
      };
      return isPresent ? string : past[string];
    }

    questions = {};
    question = undefined;
    answer = undefined;

    switch (key) {
      case "Audio format":
        questions = {
          p: `What audio format is it in?`,
          e: `What audio format is the ${type} in?`,
        };
        question = `What audio format is ${fullTitle} in?`;
        answer = `The audio format for ${fullTitle} is ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Based on":
        questions = {
          p: `What ${tense("is")} it based on?`,
          e: `What ${tense("is")} the ${type} based on?`,
        };
        question = `What ${tense("is")} ${fullTitle} based on?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} based on ${chainAnswer(infobox[key])}.`;
        break;
      case "Box office":
        questions = {
          p: `How much did it make at the box office?`,
          e: `How much did the ${type} make at the box office?`,
        };
        question = `How much did ${fullTitle} make at the box office?`;
        answer = `${capitalizeFirstLetter(fullTitle)} grossed ${chainAnswer(
          infobox[key]
        )} at the box office.`;
        break;
      case "Budget":
        questions = {
          p: `What ${tense("is")} its budget?`,
          e: `What ${tense("is")} the ${type}${possessiveType} budget?`,
        };
        question = `What ${tense("is")} ${fullTitle}${possessive} budget?`;
        answer = `The budget of ${fullTitle} ${tense("is")} ${
          handleStrip(chainAnswer(infobox[key]))
        }.`;
        break;
      case "Camera setup":
      // Skipped
      case "Cantonese":
        // Skipped
        break;
      case "Chinese":
        // Skipped
        break;
      case "Cinematography":
        questions = {
          p: `Who ${tense("is")} its cinematography by?`,
          e: `Who ${tense(
            "is"
          )} the ${type}${possessiveType} cinematography by?`,
        };
        question = `Who ${tense(
          "is"
        )} ${fullTitle}${possessive} cinematography by?`;
        answer = `The cinematography for ${fullTitle} ${tense(
          "is"
        )} by ${chainAnswer(infobox[key])}.`;
        break;
      case "Composer":
        questions = {
          p: `Who ${tense("composes")} its music?`,
          e: `Who ${tense("composes")} the ${type}${possessiveType} music?`,
        };
        question = `Who ${tense("composes")} ${fullTitle}${possessive} music?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )}${possessive} music ${tense("is")} composed by ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Country":
        questions = {
          p: `What country is it from?`,
          e: `What country is the ${type} from?`,
        };
        question = `What country is ${fullTitle} from?`;
        answer = `The country of ${fullTitle} is ${chainAnswer(infobox[key])}.`;
        break;
      case "Country of origin":
        questions = {
          p: `What is its country of origin?`,
          e: `What is the ${type}${possessiveType} country of origin?`,
        };
        question = `What is ${fullTitle}${possessive} country of origin?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )}${possessive} country of origin is ${chainAnswer(infobox[key])}.`;
        break;
      case "Created by":
        questions = {
          p: `Who ${tense("is")} it created by?`,
          e: `Who ${tense("is")} the ${type} created by?`,
        };
        question = `Who ${tense("is")} ${fullTitle} created by?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} created by ${chainAnswer(infobox[key])}.`;
        break;
      case "Directed by":
        questions = {
          p: `Who ${tense("directs")} it?`,
          e: `Who ${tense("directs")} the ${type}?`,
        };
        question = `Who ${tense("directs")} ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} directed by ${chainAnswer(infobox[key])}.`;
        break;
      case "Distributed by":
        questions = {
          p: `What company was it distributed by?`,
          e: `What company was the ${type} distributed by?`,
        };
        question = `What company was ${fullTitle} distributed by?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} distributed by ${chainAnswer(infobox[key])}.`;
        break;
      case "Distributor":
        questions = {
          p: `Who was its distributor?`,
          e: `Who was the ${type}${possessiveType} distributor?`,
        };
        question = `Who was ${fullTitle}${possessive} distributor?`;
        answer = `The distributor for${fullTitle} is ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Edited by":
        questions = {
          p: `Who edited it?`,
          e: `Who edited the ${type}?`,
        };
        question = `Who edited ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} edited by ${chainAnswer(infobox[key])}.`;
        break;
      case "Editor":
        questions = {
          p: `Who ${tense("is")} the editor for it?`,
          e: `Who ${tense("is")} the editor for the ${type}?`,
        };
        question = `Who ${tense("is")} the editor for ${fullTitle}?`;
        answer = `The editor for ${fullTitle} ${tense("is")} ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "English network":
        // Skipped
        break;
      case "Episodes":
        questions = {
          p: `How many episodes does it have?`,
          e: `How many episodes does the ${type} have?`,
        };
        question = `How many episodes does ${fullTitle} have?`;
        answer = `${capitalizeFirstLetter(fullTitle)} has ${chainAnswer(
          infobox[key]
        ).replace(" (List of episodes)", "")} episodes.`;
        break;
      case "Executive producer":
        questions = {
          p: `Who ${tense("is")} the executive producer for it?`,
          e: `Who ${tense("is")} the executive producer for the ${type}?`,
        };
        question = `Who ${tense(
          "is"
        )} the executive producer for ${fullTitle}?`;
        answer = `The executive producer for ${fullTitle} ${tense(
          "is"
        )} ${chainAnswer(infobox[key])}.`;
        break;
      case "Followed by":
        questions = {
          p: `What was it followed by?`,
          e: `What was the ${type} followed by?`,
        };
        question = `What was ${fullTitle} followed by?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )} was followed by ${chainAnswer(infobox[key])}.`;
        break;
      case "Genre":
        questions = {
          p: `What is its genre?`,
          e: `What is the ${type}${possessiveType} genre?`,
        };
        question = `What is ${fullTitle}${possessive} genre?`;
        isPlural = infobox[key].length > 1;
        answer = `The ${isPlural ? "genres" : "genre"} of ${fullTitle} ${
          isPlural ? "are" : "is"
        } ${chainAnswer(infobox[key].map((x) => x.toLowerCase()))}.`;
        break;
      case "Hepburn":
        // Skipped
        break;
      case "Japanese":
        // Skipped
        break;
      case "Language":
        questions = {
          p: `What language is it in?`,
          e: `What language is the ${type} in?`,
        };
        question = `What language is ${fullTitle} in?`;
        answer = `The language of ${fullTitle} is ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Licensed by":
        break;
      case "Music by":
        questions = {
          p: `Who ${tense("is")} its music by?`,
          e: `Who ${tense("is")} the ${type}${possessiveType} music by?`,
        };
        question = `Who ${tense("is")} ${fullTitle}${possessive} music by?`;
        answer = `The music for ${fullTitle} ${tense("is")} by ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Narrated by":
        questions = {
          p: `Who ${tense("is")} it narrated by?`,
          e: `Who ${tense("is")} the ${type} narrated by?`,
        };
        question = `Who ${tense("is")} ${fullTitle} narrated by?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )} was narrated by ${chainAnswer(infobox[key])}.`;
        break;
      case "No. of episodes":
        questions = {
          p: `How many episodes does it have?`,
          e: `How many episodes does the ${type} have?`,
        };
        question = `How many episodes does ${fullTitle} have?`;
        answer = `The number of episodes for ${fullTitle} is ${chainAnswer(
          infobox[key]
        ).replace(" (list of episodes)", "")}.`;
        break;
      case "No. of seasons":
        questions = {
          p: `How many seasons does it have?`,
          e: `How many seasons does the ${type} have?`,
        };
        question = `How many seasons does ${fullTitle} have?`;
        answer = `The number of seasons for ${fullTitle} is ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "No. of series":
        questions = {
          p: `How many series did it run for?`,
          e: `How many series did the ${type} run for?`,
        };
        question = `How many series did ${fullTitle} run for?`;
        answer = `The number of series for ${fullTitle} is ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Opening theme":
        questions = {
          p: `What is its opening theme?`,
          e: `What is the ${type}${possessiveType} opening theme?`,
        };
        question = `What is ${fullTitle}${possessive} opening theme?`;
        answer = `The opening theme for ${fullTitle} is ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Original language":
        questions = {
          p: `What language is it?`,
          e: `What language is the ${type}?`,
        };
        question = `What language is ${fullTitle}?`;
        answer = `The language of ${fullTitle} is ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Original network":
        questions = {
          p: `What network was it on?`,
          e: `What network was the ${type} on?`,
        };
        question = `What network was ${fullTitle} on?`;
        answer = `${capitalizeFirstLetter(fullTitle)} was on ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Original release":
        questions = {
          p: `When was it released?`,
          e: `When was the ${type} released?`,
        };
        question = `When was ${fullTitle} released?`;
        answer = `${capitalizeFirstLetter(fullTitle)} was released ${
          isPresent
            ? infobox[key].join(" ").replace("–", " to the ")
            : infobox[key].join(" ").replace("–", " to ")
        }.`;
        break;
      case "Original run":
        questions = {
          p: `When was its original run?`,
          e: `When was the ${type}${possessiveType} original run?`,
        };
        question = `When was ${fullTitle}${possessive} original run?`;
        answer = `The original run of ${fullTitle} was from ${
          isPresent
            ? infobox[key].join(" ").replace("–", " to the ")
            : infobox[key].join(" ").replace("–", " to ")
        }.`;
        break;
      case "Preceded by":
        questions = {
          p: `What was it preceded by?`,
          e: `What was the ${type} preceded by?`,
        };
        question = `What was ${fullTitle} preceded by?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )} was preceded by ${chainAnswer(infobox[key])}.`;
        break;
      case "Picture format":
        questions = {
          p: `What is its picture format?`,
          e: `What is the ${type}${possessiveType} picture format?`,
        };
        question = `What is ${fullTitle}${possessive} picture format?`;
        answer = `The picture format for ${fullTitle} is ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Presented by":
        questions = {
          p: `Who ${tense("is")} it presented by?`,
          e: `Who ${tense("is")} the ${type} presented by?`,
        };
        question = `Who ${tense("is")} ${fullTitle} presented by?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} presented by ${chainAnswer(infobox[key])}.`;
        break;
      case "Produced by":
        questions = {
          p: `Who produced it?`,
          e: `Who produced the ${type}?`,
        };
        question = `Who produced ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} produced by ${chainAnswer(infobox[key])}.`;
        break;
      case "Producer":
        questions = {
          p: `Who produced it?`,
          e: `Who produced the ${type}?`,
        };
        question = `Who produced ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} produced by ${chainAnswer(infobox[key])}.`;
        break;
      case "Production companies":
        questions = {
          p: `What company produced it?`,
          e: `What company produced the ${type}?`,
        };
        question = `What company produced ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} produced by ${chainAnswer(infobox[key])}.`;
        break;
      case "Production company":
        questions = {
          p: `What company produced it?`,
          e: `What company produced the ${type}?`,
        };
        question = `What company produced ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} produced by ${chainAnswer(infobox[key])}.`;
        break;
      case "Production location":
        questions = {
          p: `Where was it produced?`,
          e: `Where was the ${type} produced?`,
        };
        question = `Where was ${fullTitle} produced?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} produced in ${chainAnswer(infobox[key])}.`;
        break;
      case "Related shows":
        questions = {
          p: `What shows are related to it?`,
          e: `What shows are related to the ${type}?`,
        };
        question = `What show are related to ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )} is related to the ${chainAnswer(infobox[key])}.`;
        break;
      case "Release date":
        questions = {
          p: `When was it released?`,
          e: `When was the ${type} released?`,
        };
        question = `When was ${fullTitle} released?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )} was released on ${chainAnswer(infobox[key])}.`;
        break;
      case "Rotten Tomatoes":
        questions = {
          p: `What is its Rotten Tomatoes score?`,
          e: `What is the ${type}${possessiveType} Rotten Tomatoes score?`,
        };
        question = `What is ${fullTitle}${possessive} Rotten Tomatoes score?`;
        answer = `${chainAnswer(infobox[key])}`
          .replace("/", " out of ")
          .replace("The film", capitalizeFirstLetter(fullTitle))
          .replace("the film", fullTitle)
          .replace(" it ", ` ${fullTitle} `);
        break;
      case "Running time":
        questions = {
          p: `What is its running time?`,
          e: `What is the ${type}${possessiveType} running time?`,
        };
        question = `What is ${fullTitle}${possessive} running time?`;
        answer = `The running time of ${fullTitle} is ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Screenplay by":
        questions = {
          p: `Who was its screenplay by?`,
          e: `Who was the ${type}${possessiveType} screenplay by?`,
        };
        question = `Who was ${fullTitle}${possessive} screenplay by?`;
        answer = `The screenplay for ${fullTitle} was by ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Starring":
        questions = {
          p: `Who starred in it?`,
          e: `Who starred in the ${type}?`,
        };
        question = `Who starred in ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} stars ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Story by":
        questions = {
          p: `Who was its story by?`,
          e: `Who was the ${type}${possessiveType} story by?`,
        };
        question = `Who was ${fullTitle}${possessive} story by?`;
        answer = `The story for ${fullTitle} was by ${chainAnswer(
          infobox[key]
        )}.`;
        break;
      case "Studio":
        questions = {
          p: `What studio worked on it?`,
          e: `What studio worked on the ${type}?`,
        };
        question = `What studio worked on ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )} was animated by ${chainAnswer(infobox[key])}.`;
        break;
      case "Theme music composer":
        questions = {
          p: `Who composed its theme music?`,
          e: `Who composed the ${type}${possessiveType} theme music?`,
        };
        question = `Who composed ${fullTitle}${possessive} theme music?`;
        answer = `The theme music for ${fullTitle} was composed by ${chainAnswer(
          infobox[key]
        )}.`;
      case "Voices of":
        questions = {
          p: `Whose voices did it feature?`,
          e: `Whose voices did the ${type} feature?`,
        };
        question = `Whose voices did ${fullTitle} feature?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )} featured the voices of ${chainAnswer(infobox[key])}.`;
        break;
      case "Written by":
        questions = {
          p: `Who wrote it?`,
          e: `Who wrote the ${type}?`,
        };
        question = `Who wrote ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} written by ${chainAnswer(infobox[key])}.`;
        break;
      default:
        console.log(`Error:\t${key} is unaccounted for.\tSend help!`);
    }

    if (questions && question && answer && source) {
      if (mcmode) {
        var obj = {};
        for (qKey in questions) {
          obj[qKey] = [questions[qKey], question, answer, source].join("\t");
        }
        lines.push(obj);
      } else {
        lines.push([question, answer, source].join("\t"));
      }
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * i);
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  var output = [];

  lines.forEach((arr) => {
    if (mcmode) {
      for (line in arr) {
        output.push(arr[line]);
      }
    } else {
      output.push(arr);
    }
  });

  console.log(output.join("\n"));
  clipboard = output.join("\n");
};

//*******************************//
//                               //
//              IMDb             //
//                               //
//*******************************//

const imc = () => {
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
      if (data.includes(", ")) {
        var [title, genres] = data.split(/\n/);
        imdb["Title"] = [title];
        genres = genres.split(", ");
        genres.forEach((genre) => {
          if (imdb.hasOwnProperty("Genre")) {
            if (imdbGenres.includes(genre)) {
              if (!imdb["Genre"].includes(genre)) {
                imdb["Genre"] = [...imdb["Genre"], genre];
              }
            } else {
              console.error(`${genre} should be added to the genre list!`);
            }
          } else {
            if (imdbGenres.includes(genre)) {
              imdb["Genre"] = [genre];
            } else {
              console.error(`${genre} should be added to the genre list!`);
            }
          }
        });
      }
      if (data.split(/\s{2}/)[0].includes("Approved")) {
        imdb["Title"] = [data.split(/\s{2,}/)[0].split(/\n/)[0]];
      }
      if (imdbGenres.includes(data.split(/\s{2,}/)[0].split(/\n/)[1])) {
        imdb["Title"] = [data.split(/\s{2,}/)[0].split(/\n/)[0]];
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
        if (imdb.hasOwnProperty("Genre")) {
          if (imdbGenres.includes(genre)) {
            if (!imdb["Genre"].includes(genre)) {
              imdb["Genre"] = [...imdb["Genre"], genre];
            }
          } else {
            console.error(`${genre} should be added to the genre list!`);
          }
        } else {
          if (imdbGenres.includes(genre)) {
            imdb["Genre"] = [genre];
          } else {
            console.error(`${genre} should be added to the genre list!`);
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
        "No. of Users": [users],
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
        if (imdb.hasOwnProperty("Genre")) {
          if (imdbGenres.includes(genre)) {
            if (!imdb["Genre"].includes(genre)) {
              imdb["Genre"] = [...imdb["Genre"], genre];
            }
          } else {
            console.error(`${genre} should be added to the genre list!`);
          }
        } else {
          if (imdbGenres.includes(genre)) {
            imdb["Genre"] = [genre];
          } else {
            console.error(`${genre} should be added to the genre list!`);
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
        if (
          !!value[0].match(/\, | \| /) &&
          !key.includes("Filming Locations")
        ) {
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
      var temp = title.replace(/– \)|–\d{4}\)|\)/, "").split(/[\s]{1,}\(/);
      var [title, year] = temp;
      return ["the", year, type, title].join(" ");
    }

    function formatReleaseDate(datelocale) {
      var [date, locale] = datelocale.replace(")", "").split(/\s{1}\(/);
      if (countryConverstion.hasOwnProperty(locale)) {
        locale = countryConverstion[locale];
      }
      return `in ${locale} on ${date}`;
    }

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function lowercaseFirstLetter(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    }

    function formatRunTime(time) {
      if (!!time.match(/minutes|minute|hour|hours/)) {
        if (
          !!time.match(/1 hours|1 minutes/) &&
          !time.match(/\d{2,} hours|\d{2,} minutes/)
        ) {
          return time
            .replace("1 hours", "1 hour")
            .replace("1 minutes", "1 minute");
        }
        return time;
      }
      var temp = time;
      if (!!time.match(/1h\s{0,}/) && !time.match(/\d{2,}h\s{0,}/)) {
        temp = temp.replace("h", " hour");
      } else {
        temp = temp.replace("h", " hours");
      }
      if (!!time.match(/1min\s{0,}/) && !time.match(/\d{2,}min\s{0,}/)) {
        temp = temp.replace("min", " minute");
      } else {
        temp = temp.replace("min", " minutes");
      }
      return temp;
    }

    function formatLocation(location, isRunning) {
      if (isRunning) {
        return location
          .replace("USA", "the United States")
          .replace("UK", "the United Kingdom");
      }
      return location
        .replace("USA", "United States")
        .replace("UK", "United Kingdom");
    }

    var questions = undefined;
    var question = undefined;
    var answer = undefined;
    var source = chain(imdb["URL"]);
    var fullType = imdb.hasOwnProperty("Type")
      ? imdb["Type"]
      : [
          `Film ${
            imdb["Title"][0].match(/\(\d{4}- \)|\(\d{4}\)|\(\d{4}–\d{4}\)/)[0]
          }`,
        ];
    var type = chain(fullType)
      .split(" (")[0]
      .replace("TV", "Television")
      .toLowerCase();
    var title = chain(
      type !== "film"
        ? [
            `${imdb["Title"]} ${chain(
              imdb["Type"][0].match(/\(\d{4}– \)|\(\d{4}\)|\(\d{4}–\d{4}\)/)
            )}`,
          ]
        : imdb["Title"]
    );
    var possessive = type[type.length - 1] === "s" ? "'" : "'s";
    var fullTitle = formatTitle(title, type, fullType[0]);
    var possessiveTitle = fullTitle[fullTitle.length - 1] === "s" ? "'" : "'s";
    var isInProduction =
      !!chain(fullType).match(/\(\d{4}–\s\)/) && !fullType[0].includes("Mini");
    var fullTitle = formatTitle(title, type, fullType[0]);

    function tense(string) {
      var past = {
        is: "was",
        stars: "starred",
        directs: "directed",
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

        if (budget.includes("SEK")) {
          budget = `${budget.replace("SEK", "")} kronor`;
        }
        questions = {
          p: `What ${tense("is")} its budget?`,
          e: `What ${tense("is")} the ${type}${possessive} budget?`,
        };
        question = `What ${tense("is")} ${fullTitle}${possessiveTitle} budget?`;
        answer = `The budget of ${fullTitle} ${tense("is")} ${budget}.`;
        break;
      case "Color":
        break;
      case "Country":
        questions = {
          p: `What is its country of origin?`,
          e: `What is the ${type}${possessive} country of origin?`,
        };
        question = `What is ${fullTitle}${possessiveTitle} country of origin?`;
        answer = `The country of ${fullTitle} is ${formatLocation(
          chain(imdb["Country"]),
          true
        )}.`;
        break;
      case "Creator":
        questions = {
          p: `Who is the creator of it?`,
          e: `Who is the creator of the ${type}?`,
        };
        question = `Who is the creator of ${fullTitle}?`;
        answer = `The creator of ${fullTitle} is ${chain(imdb["Creator"])}.`;
        break;
      case "Creators":
        questions = {
          p: `Who is the creator of it?`,
          e: `Who is the creator of the ${type}?`,
        };
        question = `Who is the creator of ${fullTitle}`;
        answer = `The creators of ${fullTitle} are ${chain(imdb["Creators"])}.`;
        break;
      case "Cumulative Worldwide Gross":
        var gross = imdb["Cumulative Worldwide Gross"];
        questions = {
          p: "How much did it gross worldwide?",
          e: `How much did the ${type} gross worldwide?`,
        };
        question = `How much did ${fullTitle} gross worldwide?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )} grossed ${gross} worldwide.`;
        break;
      case "Director":
        questions = {
          p: `Who ${tense("directs")} it?`,
          e: `Who ${tense("directs")} the ${type}?`,
        };
        question = `Who ${tense("directs")} ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} directed by ${chain(imdb["Director"])}.`;
        break;
      case "Directors":
        questions = {
          p: `Who ${tense("directs")} it?`,
          e: `Who ${tense("directs")} the ${type}?`,
        };
        question = `Who ${tense("directs")} ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} directed by ${chain(imdb["Directors"])}.`;
        break;
      case "Filming Locations":
        questions = {
          p: `Where ${tense("is")} it shot?`,
          e: `Where ${tense("is")} the ${type} shot?`,
        };
        question = `Where ${tense("is")} ${fullTitle} shot?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} shot in ${formatLocation(chain(imdb["Filming Locations"]), false)}.`;
        break;
      case "Genre":
        var genres = imdb["Genre"];
        questions = {
          p: `What genre is it?`,
          e: `What genre is the ${type}?`,
        };
        question = `What genre is ${fullTitle}?`;
        answer = `The ${
          genres.length > 1 ? "genres" : "genre"
        } of ${fullTitle} ${genres.length > 1 ? "are" : "is"} ${chain(
          genres
        ).toLowerCase()}.`;
        break;
        break;
      case "Gross USA":
        break;
      case "Language":
        break;
      case "Motion Picture Rating (MPAA)":
        // television parental guidelines
        if (type === "television series") {
          questions = {
            p: `What are its television parental guidelines?`,
            e: `What are the ${type}${possessive} television parental guidelines?`,
          };
          question = `What are ${fullTitle}${possessiveTitle} television parental guidelines?`;
        } else {
          questions = {
            p: `What is its movie rating?`,
            e: `What is the ${type}${possessive} movie rating?`,
          };
          question = `What is ${fullTitle}${possessiveTitle} movie rating?`;
        }
        answer = `${capitalizeFirstLetter(fullTitle)} is rated ${chain(
          imdb["Motion Picture Rating (MPAA)"].hasOwnProperty("Detailed")
            ? imdb["Motion Picture Rating (MPAA)"].Detailed
            : imdb["Motion Picture Rating (MPAA)"].Short
        )}.`;
        break;
      case "Opening Weekend USA":
        break;
      case "Original Title":
        break;
      case "Plot":
        questions = {
          p: `What is its plot?`,
          e: `What is the ${type}${possessive} plot?`,
        };
        question = `What is ${fullTitle}${possessiveTitle} plot?`;
        answer = `${chain(imdb["Plot"]).split(/\n/)[0]}`;
        break;
      case "Production Co":
        questions = {
          p: `What company produced it?`,
          e: `What company produced the ${type}?`,
        };
        question = `What company produced ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} was produced by ${chain(
          imdb["Production Co"]
        )}.`;
        break;
      case "Rating":
        questions = {
          p: `What is its IMDb User Rating?`,
          e: `What is the ${type}${possessive} IMDb User Rating?`,
        };
        question = `What is ${fullTitle}${possessiveTitle} IMDb User Rating?`;
        answer = `${chain(
          imdb["Rating"]["No. of Users"]
        )} IMDb users have given a weighted average vote of ${chain(
          imdb["Rating"]["Average Rating"]
        ).replace("/", "out of")} for ${fullTitle}.`;
        break;
      case "Release Date":
        var ftCheckQ = imdb["Release Date"][0].includes("2021") ? "is" : "was";
        var ftCheckA = imdb["Release Date"][0].includes("2021")
          ? "will be"
          : "was";
        questions = {
          p: `When ${ftCheckQ} its release date?`,
          e: `When ${ftCheckQ} the ${type}${possessive} release date?`,
        };
        question = `What ${ftCheckQ} ${fullTitle}${possessiveTitle} release date?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )} ${ftCheckA} released ${formatReleaseDate(
          chain(imdb["Release Date"])
        )}.`;
        break;
      case "RuntimeM":
        break;
      case "RuntimeHM":
        questions = {
          p: `What is its runtime?`,
          e: `What is the ${type}${possessive} runtime?`,
        };
        question = `What is ${fullTitle}${possessiveTitle} runtime?`;
        answer = `${capitalizeFirstLetter(
          fullTitle
        )}${possessiveTitle} runtime is ${formatRunTime(
          chain(imdb["RuntimeHM"])
        )}.`;
        break;
      case "Sound Mix":
        break;
      case "Stars":
        questions = {
          p: `Who ${tense("stars")} in it?`,
          e: `Who ${tense("stars")} in the ${type}?`,
        };
        question = `Who ${tense("stars")} in ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} stars ${chain(
          imdb["Stars"]
        )}.`;
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
          e: `Who wrote the ${type}?`,
        };
        question = `Who wrote ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} written by ${chain(imdb["Writer"])}.`;
        break;
      case "Writers":
        questions = {
          p: `Who wrote it?`,
          e: `Who wrote the ${type}?`,
        };
        question = `Who wrote ${fullTitle}?`;
        answer = `${capitalizeFirstLetter(fullTitle)} ${tense(
          "is"
        )} written by ${chain(imdb["Writers"])}.`;
        break;
      default:
        console.error(`${key} has not been accounted for in this version.`);
    }

    if (questions && question && answer && source) {
      if (mcmode) {
        var obj = {};
        for (qKey in questions) {
          obj[qKey] = [
            questions[qKey],
            question,
            answer,
            key === "Rating" ? source + "/ratings?ref_=tt_ov_rt" : source,
          ].join("\t");
        }
        lines.push(obj);
      } else {
        lines.push(
          [
            question,
            answer,
            key === "Rating" ? source + "/ratings?ref_=tt_ov_rt" : source,
          ].join("\t")
        );
      }
    }
  }

  var output = [];

  lines.forEach((arr) => {
    if (mcmode) {
      for (line in arr) {
        output.push(arr[line]);
      }
    } else {
      output.push(arr);
    }
  });

  console.log(output.join("\n"));
  clipboard = output.join("\n");
};

const gotMessage = (request, sender, sendResponse) => {
  console.clear();
  const url = request.tabUrl;
  if (url.includes("https://en.wikipedia.org/wiki/")) {
    wmc();
  }
  if (url.includes("https://www.imdb.com/title/tt")) {
    imc();
  }
  if (clipboard) {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = clipboard;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    console.log("Copied to clipboard!");
  }
};

chrome.runtime.onMessage.addListener(gotMessage);
