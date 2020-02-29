console.log("Chrome extension running");

const clear = () => {
  const ytdThumbnails = document.querySelectorAll("ytd-thumbnail");
  const ytdPlaylistThumbnails = document.querySelectorAll("ytd-playlist-thumbnail");
  const nodes = [...ytdThumbnails, ...ytdPlaylistThumbnails]
  for (el of nodes) {
    el.style.display = "none";
  }
  console.log("YouTube video thumbnails and compact playlists cleared!");
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
