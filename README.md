# myanmar-names.js

Two features:

- Sort a list of Myanmar / Burmese names using JavaScript
- Find possible matches for a Myanmar / Burmese name using some matching rules from a large dataset

## Sorting

Removes prefixes and sorts by official alphabetic order (yes, you will need a library for this, not .sort())

On the client-side, this library uses Intl.Collator. On the server, it cannot get Intl.Collator from NodeJS or the Intl npm module, so it uses an approximation.

### Usage

Pass an array of names:

```javascript
output = myanmarNameSort([
  "ဦးလှမြင့်",
  "ဦးမော"
]);
> ["ဦးမော", "ဦးလှမြင့်"]
```

Pass an array of objects, and a function to extract the name:

```javascript
output = myanmarNameSort(candidates, function(candidate) {
  return candidate.full_name;
});
```

On NodeJS, use this format:
```javascript
var myanmarNameSort = require('myanmar-names').sort;
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
