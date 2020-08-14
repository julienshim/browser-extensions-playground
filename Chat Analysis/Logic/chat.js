var users = {}

document.querySelectorAll('yt-live-chat-text-message-renderer').forEach(chatmessage => {
  var [user, message] = chatmessage.innerText.split(/\n/);
  var msgs = message.toLowerCase().split(/\.\.\.|\(|\)|!|\s/).map(x => x.trim()).filter(x => !!x.match(/[a-z]/gi) && !x.includes('@'));
  if(users[user]) {
    users[user] = users[user].concat(msgs)
  } else {
    users[user] = msgs
  }
})

for (user in users) {
  var obj = {}
  users[user].forEach(word => {
    if(obj[word]) {
      obj[word] += 1
    } else {
      obj[word] = 1
    }
  })
  users[user] = obj
}

var big = {};


for (user in users) {
  for (word in users[user]) {
    if(big[word]) {
      big[word] += 1
    } else {
      big[word] = 1
    }
  }
}

console.log(big)

var wordArr = [];

for (word in big) {
  if (big[word] > 2) {
    wordArr.push([word, big[word]])
  }
}

wordArr = wordArr.sort((a,b) => b[1] - a[1]).map(x => `${x[0]}: ${String(x[1])}`)

console.log(wordArr);




// .forEach(x => {
//   var [user, message] = x.innerText.split(/\n/);
//   var msgs = {};
//   message.split(/\s/).forEach(x => {
//       if (msgs[x]) {
//           msgs[x] = msgs[x]+=1
//       } else {
//           msgs[x] = 1
//       }
//   });
//   store[user] =  msgs
// })

console.log(store)

big = {}

for (user in store) {
  for (word in user) {
    if (big[word]) {
      big[word] = big[word] += word
    } else {
      big[word] = word
    }
  }
}
console.log(big)