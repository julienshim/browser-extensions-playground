console.log("Browser extension running...");

const gotMessage = (request, sender, sendResponse) => {
  console.log(request.text);
}

chrome.runtime.onMessage.addListener(gotMessage);
