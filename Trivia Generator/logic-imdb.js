// rating test
var userRating = document.querySelector('div.ratings_wrapper').innerText.split(/\s/);
var url = window.location.href.match(/https:\/\/www.imdb.com\/title\/tt+\d{1,}/)[0];
var ratingUrl = `${url}/ratings?ref_=tt_ov_rt`;

console.log(`What was the IDMB users rating for ${title}\t${userRating[1]} IMDB users have given a weighted average vote of ${userRating[0].split("/").join(" / ")} for ${title}\t${ratingUrl}`);

var rows = [];

// Capture Plot, Director, Writers, Stars
var first = document.querySelector('div.summary_text');
var el = first;

while (el !== null) {
  rows.push(el);
  el = el.nextElementSibling;
}
rows = rows.map(x => x.innerText);

// Capture Title, Rating, Time, Genre, Release
var second = document.querySelector('div.title_wrapper').innerText.split(' | ');
rows = rows.concat(second.shift().split(/\n/).concat(second))

// IMDb User Rating
var third = document.querySelector('div.ratings_wrapper').innerText.split(/\s/).slice(0,2);
var [rating, users] = third;
rows = rows.concat([`IMDb users have given a weighted average vote of ${rating.replace("/", " / ")} for $title`])

// MPAA Rating
var fourth = document.querySelector('#titleStoryLine > h2');
var sBlock = [];
el = fourth;
while (el !== null) {
  sBlock.push(el);
  el = el.nextElementSibling;
}
sBlock = sBlock.map(x => x.innerText);
sBlock = sBlock.filter(x => x && x.includes('MPAA'))[0].split(' | ')[0].replace(/\n/, ': ');
rows = rows.concat(sBlock)

// Capture Country, Language, Release Date, AKA, Filming Locations, Budget, Opening Weekend, Gross, Cumulative Worldwide Gross, Production Co, Runtime, Sound Mix, Color, Aspect Ratio
var fifth = document.querySelector('#titleDetails > h2');
var dBlock = [];
el = fifth;
while(el !== null) {
  dBlock.push(el);
  el = el.nextElementSibling;
}
dBlock = dBlock.map(x => x.innerText);
dBlock = dBlock.filter(x => {
  var exclude = [
    "Details",
    "Edit",
    "Box Office", 
    "Company Credits",
    "Technical Specs",
    "full technical specs",
  ]
  return x && !x.includes('Official Sites:') && !x.includes('more on IMDbPro') && !exclude.includes(x);
}).map(x => x.replace(/(:\s{0,})/g, ": ").split("See more")[0].trim())
console.log(dBlock)

rows = rows.concat(dBlock);

console.log(rows);