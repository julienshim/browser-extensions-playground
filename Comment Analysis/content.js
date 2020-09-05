function scrapeComments(){
  return arr = [...document.querySelectorAll('ytd-comment-thread-renderer')].map(x => {
    if(!x.innerText.includes('고정함')) {
        var [user, time, comment, likes, reply, replies] = x.innerText.split(/\n/);
        return {user, comment}
    }
  }).filter(x => x);
}

const target = document.body;
const Observer = new MutationObserver(() => {
  scrapeComments();
});

Observer.observe(target, {
  attributes: false,
  childList: true,
  subtree: true
});

