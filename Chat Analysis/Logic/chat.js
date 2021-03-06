var users = {}
var words = [];

var stopWord = [".", "a", "about", "above", "after", "again", "against", "all", "also", "am", "an", "and", "any", "are", "areas", "aren't", "as", "at", "b", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "can't", "cannot", "coming", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "e", "each", "etc", "few", "for", "from", "further", "g", "get", "give", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "im", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "just", "less", "let's", "like", "lot", "many", "may", "me", "more", "most", "mustn't", "my", "myself", "need", "no", "nor", "not", "of", "off", "on", "once", "one", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "really", "s", "same", "say", "set", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "t", "take", "tell", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "time", "to", "too", "under", "until", "up", "us", "use", "very", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "well", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "will", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"] 

// Collect Comments and Words

var parent = document.querySelector('ytd-live-chat-frame iframe');
var children = parent.contentWindow.document.querySelectorAll('yt-live-chat-text-message-renderer')

children.forEach(chatmessage => {
  var [user, message] = chatmessage.innerText.split(/\n/)
  if (!!message.match(/[a-z]/gi)) {
    if(users[user]) {
      var obj = {
        msg: message.trim(),
        keyword: [...message.match(/[a-z]{1,}/gi)].map(x => x.toLowerCase())

      }
      users[user] = {
        count: users[user].count += 1,
        msgs: [...users[user].msgs, obj],
      }
    } else {
      var newObj = {
        msg: message.trim(),
        keyword: [...message.match(/[a-z]{1,}/gi)].map(x => x.toLowerCase())

      }
      users[user] = {
        count: 1, 
        msgs: [newObj]
      }
    }
  }
  var valid = message.match(/[a-z]{1,}/gi);
  if (valid) {
    words = words.concat(valid.map(x => x.toLowerCase()).filter(x => x.length > 1 && !stopWord.includes(x)))
  }
})

var wordArr = []

// Words become arr of unique words
words = [...new Set(words)].sort();

// console.log(users)

var analysis = [];

words.forEach(word => {
  var obj = {
    keyword: word,
    chatter: []
    // tags: []
  }

  for (user in users) {
    users[user].msgs.forEach(milk => {
      var {keyword, msg} = milk;
      if(keyword.includes(word)) {
        obj.chatter.push(`${user}: ${msg}`);
        // var newKeys = keyword.filter(x => x !== keyword && x.length > 2);
        // obj.tags.push(...newKeys);
      };
    })
  }
  obj.count = obj.chatter.length;
  analysis.push(obj);
})

console.log(analysis.sort((a,b) => b.count - a.count).filter(x => x.count > 0));



// console.log(wordArr.filter(x => x.count > 9));
// console.log(users);
console.log(words);


