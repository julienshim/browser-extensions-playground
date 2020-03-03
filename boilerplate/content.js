console.log("Browser extension running...");

const gotMessage = (request, sender, sendResponse) => {
  console.log(request);
}

chrome.runtime.onMessage.addListener(gotMessage);
