function getWords(courseId, level) {
  const url = `https://www.memrise.com/ajax/session/?course_id=${courseId}&level_index=${level}&session_slug=preview`;
  const data = { credentials: "same-origin" };

  return fetch(url, data)
    .then((response) => {
      return response.status === 200
        ? response
            .json()
            // map results
            .then((data) => {
              return Object.keys(data.screens).map((row) => {
                const { item, definition, attributes } = data.screens[row]["1"];
                const object = {
                  korean: item.value,
                  english: definition.value,
                  pronuncation: attributes[0].value,
                  hanja: attributes.length > 1 ? attributes[1].value : ''
                };
                return object;
              });
            })
            .then((words) => {
              return getWords(courseId, level + 1).then(
                words.concat.bind(words)
              );
            })
        : [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}

// fetch
let start = 1;
let courseId = location.href.match(/(?:[\d]{1,})/)[0];
getWords(courseId, start)
  // format as csv
  .then((words) => {
    return words
      .map((word) => {
        const {korean, english, pronuncation, hanja} = word;
        return [korean, english, pronuncation, hanja].join("\t");
      })
      .join("\n");
  })
  // print
  .then(console.log);