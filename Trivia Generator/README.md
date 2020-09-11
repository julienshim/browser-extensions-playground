# Trvia Generator

Trivia Generator pulls information from the infobox card, as well as looks for points of interest in the paragraphs of TV/film Wikipedia articles. It also pulls general information from TV/from IMDb articles. The information pulled is then converted to simple Q&A.

## Requirements

- Chrome Browser

## Installation

Note: `background.js`, `content.js`, and `manifest.json` files must be in a single folder.

1. Click the Extensions icon in Chrome
   <img src="https://storage.googleapis.com/support-forums-api/attachment/thread-14033830-12399559427379765140.jpg">

2. Click `Manage Extensions`
3. Enable `Developer mode`
4. Click `Load unpacked extension`
5. Select or click into folder containing the `background.js`, `content.js` and `manifest.json`.
6. Make sure that the extension loads successfully, and then click the Extensions icon in Chrome to make sure it's pinned.

## In-Use

Currently, the `manifest.json` targets certain URLs in order for the extension to be loaded.

```
  ...
    "content_scripts": [
      {
        "matches: [
          "https://en.wikipedia.org/wiki/*",
          "https://www.imdb.com/title/tt*"
        ],
        ...
      }
    ]
  ...
```

1. Hit Command+Option+J (Mac) or Control+Shift+J (Windows, Linux, Chrome OS) to open the console when visting a target URL.
2. 'Browser extension is running' should be read.
3. Click the extension button `T`.
4. `Question` `Answer` `Source` rows should print out into the console. Note the `Copied to clipboard!` for user convenience to paste into a spreadsheet.

## Screenshots

<img src="https://github.com/julienshim/browser-extensions-playground/blob/master/Trivia%20Generator/images/typew.png?raw=true" width="500">

<img src="https://github.com/julienshim/browser-extensions-playground/blob/master/Trivia%20Generator/images/typei.png?raw=true" width="500">

## Data Objects Generated

Note: Any data marked `//SKIPPED` will be either handled at a later time or remoevd.

### Wikipedia data object

```
{
  "Audio format": [],
  "Based on": [],
  "Box office": [],
  "Budget": [],;
  "Camera setup": [], //SKIPPED
  "Cantonese": [], //SKIPPED
  "Chinese": [], //SKIPPED
  "Cinematography": [],
  "Composer": [],
  "Country": [],
  "Country of origin": [],
  "Created by": [],
  "Directed by": [],
  "Distributed by": [],
  "Distributor": [],
  "Edited by": [],
  "Editor": [],
  "English network": [], //SKIPPED
  "Episodes": [],
  "Executive producer": [],
  "Followed by": [],
  "Genre": [],
  "Hepburn": [], //SKIPPED
  "Japanese": [], //SKIPPED
  "Language": [],
  "Licensed by": [],
  "Music by": [],
  "Narrated by": [],
  "No. of episodes": [],
  "No. of seasons": [],
  "No. of series": [],
  "Opening theme": [],
  "Original language": [],
  "Original network": [],
  "Original release": [],
  "Original run": [],
  "Preceded by": [],
  "Picture format": [],
  "Presented by": [],
  "Produced by": [],
  "Producer": [],
  "Production companies": [],
  "Production company": [],
  "Production location": [],
  "Related shows": [],
  "Release date": [],
  "Rotten Tomatoes": [],
  "Running time": [],
  "Screenplay by": [],
  "Starring": [],
  "Story by": [],
  "Studio": [],
  "Theme music composer": [],
  "Voices of": [],
  "Written by": [],
}
```

### IMDb data object

```
{
  "Also Known As": [],
  "Aspect Ratio": [],
  "Budget": [],
  "Color": [],
  "Country": [],
  "Creator": [],
  "Creators": [],
  "Cumulative Worldwide Gross": [],
  "Director": [],
  "Directors": [],
  "Filming Locations": [],
  "Genre": [],
  "Gross USA": [],
  "Language": [],
  "Motion Picture Rating (MPAA)": [],
  "Opening Weekend USA": [],
  "Original Title": [],
  "Plot": [],
  "Production Co": [],
  "Rating": [],
  "Release Date": [],
  "RuntimeM": [],
  "RuntimeHM": [],
  "Sound Mix": [],
  "Stars": [],
  "Storyline": [],
  "Title": [], //SKIPPED
  "Type": [], //SKIPPED
  "URL": [], //SKIPPED
  "Writer": [],
  "Writers": [],
}
```
