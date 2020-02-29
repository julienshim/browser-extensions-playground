console.log("Chrome extension running");

const clear = () => {
  console.log("cleared");
  const ytdThumbnails = document.querySelectorAll("ytd-thumbnail");
  for (el of ytdThumbnails) {
    el.style.display = "none";
  }
};

const target = document.body;
const Observer = new MutationObserver(() => {
  clear();
});

Observer.observe(target, {
  attributes: false,
  childList: true,
  subtree: true
});
