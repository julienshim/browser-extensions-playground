first = document.querySelector('#mw-content-text > div > table.infobox.vevent > tbody > tr:nth-child(3)');
el=first;
rows =[];
while(el!==null) {
  rows.push(el)
  el = el.nextElementSibling;
}