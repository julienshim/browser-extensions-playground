console.log("Chrome extension running");

const rickroll = () => {
  document.body.style.overflow = "hidden";
  const iframe = document.createElement('iframe');
  iframe.setAttribute("id", "astley");
  iframe.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0";
  iframe.height = "100%";
  iframe.width = "100%";
  iframe.style.boxSizing = "border-box";
  iframe.style.position = "absolute";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.zIndex = "9000";
  iframe.style.padding = "10%";
  iframe.style.backgroundColor = "white";
  iframe.style.margin = "0 auto";
  iframe.frameBorder = "0";
  document.body.appendChild(iframe);
  iframe.addEventListener("click", (event) => {
    document.body.style.overflow = "auto";
    const astley = document.getElementById("astley");
    astley.remove(astley);
  })
}

const links = document.querySelectorAll("a");

links.forEach(x => {
  x.href = '#';
  x.addEventListener("click", () => rickroll());
});

