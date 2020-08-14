var users = {}
var stopWord = [".", "a", "about", "above", "after", "again", "against", "all", "also", "am", "an", "and", "any", "are", "areas", "aren't", "as", "at", "b", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "can't", "cannot", "coming", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "e", "each", "etc", "few", "for", "from", "further", "g", "get", "give", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "im", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "just", "less", "let's", "like", "lot", "many", "may", "me", "more", "most", "mustn't", "my", "myself", "need", "no", "nor", "not", "of", "off", "on", "once", "one", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "really", "s", "same", "say", "set", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "t", "take", "tell", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "time", "to", "too", "under", "until", "up", "us", "use", "very", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "well", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "will", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"] 

var parent = document.querySelector('ytd-live-chat-frame iframe');
var children = parent.contentWindow.document.querySelectorAll('yt-live-chat-text-message-renderer')

children.forEach(chatmessage => {
  var [user, message] = chatmessage.innerText.split(/\n/);
  message = message.trim().toLowerCase().split(/\(|\)|\!|\?|​|\.\.\.|\s|\t|\r|\n/).filter(x => x && !stopWord.includes(x) && !x.includes('@')).map(x => {
    if(x.match(/[a-z][.,]/)) {
      return x.split(/[[.,]/)[0]
    }
    return x;
  });
  user = user.trim()
  users[user] = message
})

console.log(users);



// children.forEach(chatmessage => {
//   var [user, message] = chatmessage.innerText.split(/\n/);
//   var msgs = message.toLowerCase().split(/\.\.\.|\(|\)|!|\s/).map(x => x.trim())
//   if(users[user]) {
//     users[user] = users[user].concat(msgs)
//   } else {
//     users[user] = msgs
//   }
// })

// for (user in users) {
//   var obj = {}
//   users[user].forEach(word => {
//     if(obj[word]) {
//       obj[word] += 1
//     } else {
//       obj[word] = 1
//     }
//   })
//   users[user] = obj
// }

// var big = {};


// for (user in users) {
//   for (word in users[user]) {
//     if(big[word]) {
//       big[word] += 1
//     } else {
//       big[word] = 1
//     }
//   }
// }

// console.log(big)

// var wordArr = [];

// for (word in big) {
//   if (big[word] > 2) {
//     wordArr.push([word, big[word]])
//   }
// }

// wordArr = wordArr.sort((a,b) => b[1] - a[1]).map(x => `${x[0]}: ${String(x[1])}`)

// console.log(wordArr);




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



