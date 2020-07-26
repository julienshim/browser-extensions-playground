console.log("Browser extension running");

const getWords = (courseId, level) => {
  const url = `https://www.memrise.com/ajax/session/?course_id=${courseId}&level_index=${level}&session_slug=preview`;
  const data = { credentials: "same-origin" };

  return fetch(url, data)
    .then((response) => {
      if (response.status === 200) {
        return response
        .json()
        // map results
        .then((data) => {
          return Object.keys(data.screens).map((row) => {
            const { item, definition, attributes } = data.screens[row]["1"];
            const object = {
              korean: item.value,
              english: definition.value
            };
            if (attributes) {
              attributes.forEach((attribute) => {
                object[attribute.label] = attribute.value;
              }
            )}
            return object;
          });
        })
        .then((words) => {
          return getWords(courseId, level + 1).then(
            words.concat.bind(words)
          );
        })
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const gotMessage = (request, sender, sendResponse) => {
  const { tabUrl } = request;
  const levelStart = 1;
  const levelEnd = document.querySelectorAll('.level').length;
  const courseId = tabUrl.match(/(?:[\d]{1,})/)[0];
  getWords(courseId, levelStart, levelEnd)
    .then((words) => {
      let max = 0
      let keys = [];
      words.forEach(x => {
        if(Object.keys(x).length > max) {
          max = Object.keys(x).length;
          keys = Object.keys(x);
        }
      })
      return words
        .map((word) => {
          const string = keys.map(x => word[x]).join("\t")
          return `${string}\n`;
        })
        .join("");
    })
    // print
    .then((csv) => console.log(csv));
};

chrome.runtime.onMessage.addListener(gotMessage);