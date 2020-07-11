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

console.log(rows);