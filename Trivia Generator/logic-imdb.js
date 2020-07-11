// // rating test
// var userRating = document.querySelector('div.ratings_wrapper').innerText.split(/\s/);
// var url = window.location.href.match(/https:\/\/www.imdb.com\/title\/tt+\d{1,}/)[0];
// var ratingUrl = `${url}/ratings?ref_=tt_ov_rt`;

// console.log(`What was the IDMB users rating for ${title}\t${userRating[1]} IMDB users have given a weighted average vote of ${userRating[0].split("/").join(" / ")} for ${title}\t${ratingUrl}`);

clear()

var genres = [
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
  "Sports",
];
var imdb = {};
var capturePoint, el, captureData;

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
captureData = document
  .querySelector("div.title_wrapper")
  .innerText.split(" | ");
captureData.forEach((data, i) => {
  var format = {
    RuntimeHM: `RuntimeHM: ${data}:`,
    Genre: `Genre: ${data}`,
    "Release Date": `Release Date: ${data}`,
  };
  var temp;
  if (i === 0) {
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
        imdb['Rating'] = [Rating]
      }
    } else {
      if(!!data.match(/\d{1,}h/) || !!data.match(/\d{1,}min/)) {
        var [title, RuntimeHM] = data.split(/\n/);
        imdb['Title'] = [title]
        imdb['RuntimeHM'] = [RuntimeHM]
      } else if (!!data.match(/\nG|PG|PG-13|R|NC-17/)) {
        var [title, Rating] = data.split(/\n/);
        imdb['Title'] = [title]
        imdb['Rating'] = [Rating]
      }
    }
    
  } else if (!!data.match(/\d{1,}h/) || !!data.match(/\d{1,}min/)) {
    temp = format["RuntimeHM"];
    if (temp.includes('(')) {
      var [title, runtime] = temp.split(/\n/);
      temp = `RuntimeHM: ${runtime}`;
      imdb['Title'] = [title.split(/:\s{0,1}/)[1]];
    }
  } else if (data.includes(",") || genres.includes(data)) {
    temp = format["Genre"];
  } else if (data.includes("(")) {
    temp = format["Release Date"];
  }
  if (temp) { var [key, value] = temp.split(/:\s{0,}/) }
  if (key && value) { imdb[key] = [value]}
});

console.log(imdb);







// rows = rows.concat(second.shift().split(/\n/).concat(second))

// IMDb User Rating
var third = document
  .querySelector("div.ratings_wrapper")
  .innerText.split(/\s/)
  .slice(0, 2);
var [rating, users] = third;
rows = rows.concat([`Rating: ${rating.replace("/", " / ")}`]);

// MPAA Rating
var fourth = document.querySelector("#titleStoryLine > h2");
var sBlock = [];
el = fourth;
while (el !== null) {
  sBlock.push(el);
  el = el.nextElementSibling;
}
sBlock = sBlock.map((x) => x.innerText);
sBlock = sBlock
  .filter((x) => x && x.includes("MPAA"))[0]
  .split(" | ")[0]
  .replace(/\n/, ": ");
rows = rows.concat(sBlock);

// Capture Country, Language, Release Date, AKA, Filming Locations, Budget, Opening Weekend, Gross, Cumulative Worldwide Gross, Production Co, Runtime, Sound Mix, Color, Aspect Ratio
var fifth = document.querySelector("#titleDetails > h2");
var dBlock = [];
el = fifth;
while (el !== null) {
  dBlock.push(el);
  el = el.nextElementSibling;
}
dBlock = dBlock.map((x) => x.innerText);
dBlock = dBlock
  .filter((x) => {
    var exclude = [
      "Details",
      "Edit",
      "Box Office",
      "Company Credits",
      "Technical Specs",
      "full technical specs",
    ];
    return (
      x &&
      !x.includes("Official Sites:") &&
      !x.includes("more on IMDbPro") &&
      !exclude.includes(x)
    );
  })
  .map((x) =>
    x
      .replace(/(:\s{0,})/g, ": ")
      .split("See more")[0]
      .trim()
  );

rows = rows.concat(dBlock);

console.log(rows);
