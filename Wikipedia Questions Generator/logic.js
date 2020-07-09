// url
var source = window.location.href;

// Determine Type of Article

var type = document.querySelector("#mw-content-text > div > p:nth-child(5)")
  .textContent;

if (type.includes("television")) {
  type = "television";
} else if (type.includes("film")) {
  type = "film";
}

var title = document.querySelector("#firstHeading").textContent;

// replace 'TV' with 'television'
if (title.includes("TV")) {
  title = title.replace("TV", "television");
}

// flip title if parentheses are found
var the = "";
if (title.includes("(")) {
  the = "the ";
  var temp = title
    .replace(/[())]/g, " ")
    .trim()
    .split(/[\s]{2,}/);
  var [head, tail] = temp;
  title = [tail, head].join(" ");
}

console.log(title);

var first = document.querySelector(
  "#mw-content-text > div > table.infobox.vevent > tbody > tr:nth-child(3)"
);
var last = document.querySelector(
  "#mw-content-text > div > table.infobox.vevent > tbody > tr:nth-child(17)"
);
var rows = [];
var el = first;

while (el !== null) {
  rows.push(el);
  el = el.nextElementSibling;
}

var obj = {};

rows.forEach((x) => {
  var temp = x.children[1].innerText;
  if (temp.includes('[')) {
    temp = `${temp.slice(0,temp.indexOf('['))}`;
  }
  obj[x.children[0].textContent] = temp;
});

var list = [];

var pluralCountrys = {
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
  "Nepal": false,
};

function chain(array) {
  // TODO
  var length = array.length;

  if (length === 0) {
    return ''
  } else if (length === 1) {
    return `${array[0]}`
  } else if (length === 2) {
    return `${array[0]} and ${array[1]}`
  } else {
    return `${array.splice(0,array.length-1).join(', ')}, and ${array[array.length-1]}` 
  }
}


for (key in obj) {
  var answer = obj[key].trim().split(/\n/gi);
  // if (key === "Release date") {
  //   if (answer.length === 1){
  //     answer = answer[0]
  //   } else {
  //     answer = answer.slice(answer.length-1, answer.length);
  //   }
  // }
  console.log(answer)
  switch (key) {
    case "Directed by":
      list.push(
        `Who directed ${the}${title}?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} was directed by ${chain(answer)}.\t${source}`
      );
      break;
    case "Produced by":
      list.push(
        `Who produced ${the}${title}?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} was produced by ${chain(answer)}.\t${source}`
      );
      break;
    case "Written by":
      list.push(
        `Who wrote ${the}${title}?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} was written by ${chain(answer)}.\t${source}`
      );
      break;
    case "Starring":
      list.push(
        `Who starred ${the}${title}?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} stars by ${chain(answer)}.\t${source}`
      );
      break;
    case "Music by":
      list.push(
        `Who was the music for ${the}${title} by?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} was produced by ${chain(answer)}.\t${source}`
      );
      break;
    case "Cinematography":
      list.push(
        `Who the cinematographer for ${the}${title}?\tThe cinematographer for ${the}${title} was ${chain(answer)}.\t${source}`
      );
      break;
    case "Edited by":
      list.push(
        `Who edited ${the}${title}?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} was edited by ${chain(answer)}.\t${source}`
      );
      break;
    case "Production companies":
      list.push(
        `What company produced ${the}${title}?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} was produced by ${chain(answer)}.\t${source}`
      );
      break;
    case "Distributed by":
      list.push(
        `Who distributed ${the}${title}?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} was distributed by ${chain(answer)}.\t${source}`
      );
      break;
    case "Release date":
      list.push(
        `When was ${the}${title} released?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} was released on ${chain(answer)}.\t${source}`
      );
      break;
    case "Running time":
      list.push(
        `What is the running time of ${the}${title}?\tThe running time for ${the}${title} is ${chain(answer)}.\t${source}`
      );
      break;
    case "Country":
      list.push(
        `What country is ${the}${title} from?\tThe country of ${the}${title} is ${chain(answer)}.\t${source}`
      );
      break;
    case "Language":
      list.push(
        `What language is ${the}${title} in?\tThe language of ${the}${title} is ${chain(answer)}.\t${source}`
      );
      break;
    case "Budget":
      list.push(
        `What was the budget of ${the}${title}?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} had a production budget of ${chain(answer)}.\t${source}`
      );
      break;
    case "Box office":
      list.push(
        `How did ${the}${title} do at the box office?\t${the.charAt(0).toUpperCase() + the.slice(1)}${title} earned ${chain(answer)} at the box office.\t${source}`
      );
      break;
  }
}

console.log(list.join("\n"));
