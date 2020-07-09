// rating test
var title = document.querySelector('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper').innerText.split(/\n/)[0].match(/([a-z ]){1,}/gi)
var userRating = document.querySelector('#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper').innerText.split(/\s/);
var url = window.location.href.match(/https:\/\/www.imdb.com\/title\/tt+\d{1,}/)[0];
var ratingUrl = `${url}/ratings?ref_=tt_ov_rt`;

console.log(`${userRating[1]} IMDB users have given a weighted average vote of ${userRating[0].split("/").join(" / ")} for ${title}\t${ratingUrl}`);