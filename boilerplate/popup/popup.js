console.log("popup.html is connected to popup.js...");

const userInput = document.getElementById("userInput");

const changeText = event => {
  const params = {
    active: true,
    currentWindow: true
  };
  const gotTabs = tabs => {
    let message = {
      text: event.target.value
    };
    chrome.tabs.sendMessage(tabs[0].id, message);
  };
  chrome.tabs.query(params, gotTabs);
};

userInput.addEventListener("input", changeText);
