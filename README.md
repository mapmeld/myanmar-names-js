# myanmar-names.js

[![Greenkeeper badge](https://badges.greenkeeper.io/mapmeld/myanmar-names-js.svg)](https://greenkeeper.io/)

A NodeJS module with three features:

- Sort a list of Myanmar / Burmese names according to official alphabetic order
- Remove prefixes from Myanmar / Burmese names
- Find possible matches for a Myanmar / Burmese name using some matching rules from a large dataset

Client-side use is *possible*, but throws an error if your user does not have Intl or Myanmar locale support.

## Sorting

Removes prefixes and sorts by official alphabetic order (yes, you will need a library for this, not .sort())

On the client-side, this library uses Intl.Collator (available in modern browsers) or throws an error if it's not available.
An error is also thrown if the Myanmar locale is not available for sorting. Use a try-catch block.

On the server, you can compile NodeJS with full locale support (```brew reinstall node --with-full-icu```), follow instructions on how to add more locales to your current install with ```npm install -g full-icu``` or use the myanmar-sort module (included in package.json).

### Usage

In NodeJS, use this first:

```javascript
var myanmarNameSort = require('myanmar-names').sort;
```

Pass an array of names:

```javascript
var names = ["ဦးလှမြင့်", "ဦးမော"];
try {
  output = myanmarNameSort(names);
} catch (e) {
  // fallback
  output = names.sort();
}
> ["ဦးမော", "ဦးလှမြင့်"]
```

Pass an array of objects, and a function to extract the name:

```javascript
output = myanmarNameSort(candidates, function(candidate) {
  return candidate.full_name;
});
```

## Matching

Returns the names most likely to match a given name. Removes
prefixes, and looks at commonly mistaken and missing letters (like ထ and လ,
ဂ and ဝ, commonly missed ီ)

Pass a name string, and an array of potential matches, receive sorted list of best matches:

```javascript
myanmarNameMatch('ထမြင့်', [
  "ဦးလှမြင့်",
  "ဦးမော"
]);
> ['ဦးလှမြင့်']
```

Passing a function to extract the names:

```javascript
myanmarNameMatch('မြင့်', candidates, function(candidate) {
  return candidate.full_name;
});
```

On NodeJS, use this format:
```javascript
var myanmarNameMatch = require('myanmar-names').match;
```

## License

Prefixes [from Wikipedia](https://en.wikipedia.org/wiki/Burmese_names) under a Creative Commons license

Open Sourced with an MIT License
