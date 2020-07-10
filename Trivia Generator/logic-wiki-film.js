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
  pluralCountrys: {
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
  if (t.includes("TV")) {
    temp = t.replace("TV", "television");
    media.title.normal = temp;
  } else {
    media.title.normal = t;
  }
  if (t.includes("(")) {
    temp = t
      .replace(/[())]/g, " ")
      .trim()
      .split(/[\s]{2,}/);
    var [head, tail] = temp;
    media.title.flipped = [tail, head].join(" ");
  }
  media.title.stripped = t.replace(/[()]/g, "");
}

formatTitle(document.querySelector("#firstHeading").textContent);

// Scrape infobox

function chain(array) {
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
    console.log(item);
    return [book.trim(), chain(author.trim().split(/\n/))].join(" by ");
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
    var key = info.children[0].innerText;
    var value = info.children[1].innerText.replace(/\[\d{1,3}\]/gi, "");
    media.infobox[key] = exclude.includes(key) ? value : value.split(/\n/);
  }
});

//   if (
//     media.infobox["Based on"].split(/\s/).filter((x) => x.includes("by ")) > 1
//   ) {
//     media.infobox["Based on"] = splitBy(media.infobox["Based on"]);
//   } else {

//   }
if (media.infobox.hasOwnProperty("Based on")) {
  if (
    media.infobox["Based on"].split(/\s/).filter((x) => x.includes("by"))
      .length > 1
  ) {
    console.log("route 1");
    media.infobox["Based on"] = splitBy(media.infobox["Based on"].split(/\n/));
    console.log(media.infobox["Based on"]);
  } else {
    var [book, author] = media.infobox["Based on"].split("by ");
    media.infobox["Based on"] = [
      book.trim(),
      chain(author.trim().split(/\n/)),
    ].join(" by ");
    console.log(media.infobox["Based on"]);
  }
}

//
var obj = {};

rows.forEach((x) => {
  var temp = x.children[1].innerText;
  if (temp.includes("[")) {
    temp = `${temp.slice(0, temp.indexOf("["))}`;
  }
  obj[x.children[0].textContent] = temp;
});

var list = [];

for (key in obj) {
  var answer = obj[key].trim().split(/\n/gi);
  // if (key === "Release date") {
  //   if (answer.length === 1){
  //     answer = answer[0]
  //   } else {
  //     answer = answer.slice(answer.length-1, answer.length);
  //   }
  // }
  console.log(answer);
  switch (key) {
    case "Directed by":
      list.push(
        `Who directed ${the}${title}?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} was directed by ${chain(answer)}.\t${source}`
      );
      break;
    case "Produced by":
      list.push(
        `Who produced ${the}${title}?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} was produced by ${chain(answer)}.\t${source}`
      );
      break;
    case "Written by":
      list.push(
        `Who wrote ${the}${title}?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} was written by ${chain(answer)}.\t${source}`
      );
      break;
    case "Starring":
      list.push(
        `Who starred ${the}${title}?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} stars by ${chain(answer)}.\t${source}`
      );
      break;
    case "Music by":
      list.push(
        `Who was the music for ${the}${title} by?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} was produced by ${chain(answer)}.\t${source}`
      );
      break;
    case "Cinematography":
      list.push(
        `Who the cinematographer for ${the}${title}?\tThe cinematographer for ${the}${title} was ${chain(
          answer
        )}.\t${source}`
      );
      break;
    case "Edited by":
      list.push(
        `Who edited ${the}${title}?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} was edited by ${chain(answer)}.\t${source}`
      );
      break;
    case "Production companies":
      list.push(
        `What company produced ${the}${title}?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} was produced by ${chain(answer)}.\t${source}`
      );
      break;
    case "Distributed by":
      list.push(
        `Who distributed ${the}${title}?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} was distributed by ${chain(answer)}.\t${source}`
      );
      break;
    case "Release date":
      list.push(
        `When was ${the}${title} released?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} was released on ${chain(answer)}.\t${source}`
      );
      break;
    case "Running time":
      list.push(
        `What is the running time of ${the}${title}?\tThe running time for ${the}${title} is ${chain(
          answer
        )}.\t${source}`
      );
      break;
    case "Country":
      list.push(
        `What country is ${the}${title} from?\tThe country of ${the}${title} is ${chain(
          answer
        )}.\t${source}`
      );
      break;
    case "Language":
      list.push(
        `What language is ${the}${title} in?\tThe language of ${the}${title} is ${chain(
          answer
        )}.\t${source}`
      );
      break;
    case "Budget":
      list.push(
        `What was the budget of ${the}${title}?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} had a production budget of ${chain(answer)}.\t${source}`
      );
      break;
    case "Box office":
      list.push(
        `How did ${the}${title} do at the box office?\t${
          the.charAt(0).toUpperCase() + the.slice(1)
        }${title} earned ${chain(answer)} at the box office.\t${source}`
      );
      break;
  }
}

// console.log(list.join("\n"));

// Points of interest

var raw = [...document.querySelectorAll("p")];
var interests = [];
var filinterests = [];

raw.forEach((x) => {
  // interests = interests.concat(` ${x.textContent}`.match(/\s+[^.]*[.]/gi))
  interests = interests.concat(` ${x.textContent}`.split(/(?<!\..)[.?!]\s+/gi));
  // interests = interests.concat(` ${x.textContent}`.replace(/\s[a-z]{1,2}\./, ).replace(/\[\d{1,2}\]/gi, '').replace(/\s{2}/, " ").split(/(?<!\..)[.?!]\s+/gi).map(x=> `${x.trim()}.`).filter(x => x.split(' ').length < 30))
});

interests = interests.filter((x) => x.trim()).map((x) => `${x.trim()}.`);

var n = 0;
var clean = [];

while (n < interests.length) {
  if (interests[n].match(/\s[a-z]{1,2}\./gi)) {
    clean.push(`${interests[n]} ${interests[n + 1]}`);
    n += 2;
  } else {
    clean.push(interests[n]);
    n += 1;
  }
}

clean.forEach((x) => {
  media.keyterms.forEach((y) => {
    if (x.includes(y)) {
      filinterests.push(x);
    }
  });
});

console.log(
  [...new Set(filinterests)]
    .filter((x) => x.split(" ").length < 30)
    .map((x) => x.replace(/\[\d{1,2}\]/gi, ""))
);
