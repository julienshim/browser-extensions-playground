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

function chain2(array) {
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
      chain(author.trim().split(/\n/)),
    ].join(" by ")];
  }
}
console.log(media);
console.log(media.infobox)

//
// var obj = {};

// rows.forEach((x) => {
//   var temp = x.children[1].innerText;
//   if (temp.includes("[")) {
//     temp = `${temp.slice(0, temp.indexOf("["))}`;
//   }
//   obj[x.children[0].textContent] = temp;
// });

var list = [];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

for (key in media.infobox) {
  var infobox = media.infobox;
  var title = media.title.flipped ? `the ${media.title.flipped}` : media.title.normal;
  var possessive = title[title.length-1] === 's' ? '\'s' : '\'s';
  var source = media.source;
  var line = [];
  switch(key) {
    case "Based on":
      line = [`What is ${title} based on?`, `${capitalizeFirstLetter(title)} is based on ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Box office":
      line = [`How did ${title} do at the box office?`, `${capitalizeFirstLetter(title)} earned ${chain2(infobox[key])} at the box office.`, `${source}`]
      break;
    case "Budget":
      line = [`What the budget of ${title}?`, `The budget of ${capitalizeFirstLetter(title)} is ${chain2(infobox[key])}.`, `${source}`]
      break;
    // case "Cantonese":
      
    //   break;
    // case "Chinese":
      
    //   break;
    case "Cinematography":
      line = [`Who was the cinematography for ${title} by?`, `The cinematography for ${title} was by ${chain2(infobox[key])}.`, `${source}`]
      break;
    // case "Composer":
      
    //   break;
    case "Country":
      line = [`What is the country of ${title}?`, `The country of ${title} is ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Country of origin":
      line = [`What is ${title}${possessive}?`, `${capitalizeFirstLetter(title)}${possessive} country of origin is ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Created by":
      line = [`Who was ${title} created by?`, `${capitalizeFirstLetter(title)} was created by ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Directed by":
      line = [`Who directed ${title}?`, `${capitalizeFirstLetter(title)} was directed by ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Distributed by":
      line = [`Who distributed ${title}?`, `${capitalizeFirstLetter(title)} was distributed by ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Distributor":
      line = [`Who the distributor for ${title}?`, `The distributor for${title} is  ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Edited by":
      line = [`Who edited ${title}?`, `${capitalizeFirstLetter(title)} was edited by ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Editor":
      line = [`Who was the editor for ${title}?`, `The editor for ${title} was ${chain2(infobox[key])}.`, `${source}`]
      break;
    // case "English network":
      
    //   break;
    // case "Episodes":
      
    //   break;
    // case "Executive producer":
      
    //   break;
    case "Genre":
      line = [`What is the genre of ${title}?`, `The genre of ${title} is ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Language":
      line = [`What is the language of ${title}?`, `The language of ${title} is ${chain2(infobox[key])}.`, `${source}`]

      break;
    // case "Licensed by":
      
    //   break;
    case "Music by":
      line = [`Who was the music for ${title} by?`, `The music for ${title} was by ${chain2(infobox[key])}.`, `${source}`]
      break;
    // case "No. of episodes":
      
    //   break;
    // case "No. of seasons":
      
    //   break;
    // case "Opening theme":
      
    //   break;
    case "Original language":
      line = [`What was ${title}${possessive} original language?`, `${title}${possessive} original language was ${chain2(infobox[key])}.`, `${source}`]
      break;
    // case "Original network":
      
    //   break;
    case "Original release":
      line = [`Who was ${title}${possessive} original release?`, `${capitalizeFirstLetter(title)}${possessive} original release was ${chain2(infobox[key])}.`, `${source}`]
      break;
    // case "Original run":
      
    //   break;
    // case "Preceded by":
      
    //   break;
    case "Produced by":
      line = [`Who produced ${title}?`, `${capitalizeFirstLetter(title)} was produced by ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Producer":
      line = [`Who was the produce for ${title}?`, `The produce for ${capitalizeFirstLetter(title)} was ${chain2(infobox[key])}.`, `${source}`]
      break;
    // case "Production companies":
    //   list.push(
    //     `What company produced ${the}${title}?\t${
    //       the.charAt(0).toUpperCase() + the.slice(1)
    //     }${title} was produced by ${chain(answer)}.\t${source}`
    //   );
    //   break;
    case "Production company":
      line = [`What company produced ${title}?`, `${capitalizeFirstLetter(title)} was produced by ${chain2(infobox[key])}.`, `${source}`]
      break;
    // case "Production location":
      
    //   break;
    // case "Related shows":
      
    //   break;
    case "Release date":
      line = [`When was ${title} released?`, `${capitalizeFirstLetter(title)} was released on ${chain2(infobox[key])}.`, `${source}`]
      break;
    case "Running time":
      line = [`What is the running time of ${title}?`, `The running time of ${title} is ${chain2(infobox[key])}.`, `${source}`]
      break;
    // case "Screenplay by":
      
    //   break;
    case "Starring":
      line = [`Who starred in ${title}?`, `${capitalizeFirstLetter(title)} stars ${chain2(infobox[key])}.`, `${source}`]
      break;
    // case "Studio":
      
    //   break;
    case "Written by":
      line = [`Who wrote ${title}?`, `${capitalizeFirstLetter(title)} was written by ${chain2(infobox[key])}.`, `${source}`]
      break;
    default:
      console.log(`Error:\t${key} is unaccounted for.\tSend help!`)
  }
  list.push(line.join("\t"))
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

console.log(list)
console.log(shuffleArray(list).join("\n"));

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


