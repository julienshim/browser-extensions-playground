console.log('Background running...')

const buttonClicked = (tab) => {
  let msg = {
    text: "hello"
  }
  chrome.tabs.sendMessage(tab.id, msg);
}

chrome.browserAction.onClicked.addListener(buttonClicked);
