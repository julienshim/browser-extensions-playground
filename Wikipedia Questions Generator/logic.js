
// Determine Type of Article

var type = document.querySelector('#mw-content-text > div > p:nth-child(2)').textContent;

if (type.includes('television')) {
  type = 'television';
} else if (type.includes('film')) {
  type = 'film';
}

var title = document.querySelector('#firstHeading').textContent;

// replace 'TV' with 'television'
if (title.includes('TV')) {
  title = title.replace('TV', 'television');
}

// flip title if parentheses are found
var the = '';
if (title.includes('(')) {
  the = 'the ';
  var temp = title.replace(/[())]/g, ' ').trim().split(/[\s]{2,}/);
  const [head, tail] = temp;
  title = [tail, head].join(" ");
}

console.log(title);

var first = document.querySelector('#mw-content-text > div > table.infobox.vevent > tbody > tr:nth-child(3)');
var last = document.querySelector('#mw-content-text > div > table.infobox.vevent > tbody > tr:nth-child(17)');
var rows = [];
var el = first;

while (el !== null) {
    rows.push(el);
    el = el.nextElementSibling  
}

var obj = {};

rows.forEach( x=> {
  obj[x.children[0].textContent] = x.children[1].textContent
})

console.log(obj)