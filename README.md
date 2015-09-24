# myanmar-names.js

Sort a list of Myanmar language / Burmese names using JavaScript

Removes prefixes and sorts by official alphabetic order (yes, you will need a library for this, not .sort())

On the client-side, this library uses Intl.Collator. On the server, it cannot get Intl.Collator from NodeJS or the Intl npm module, so it uses an approximation.

## Usage

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

In NodeJS:

```javascript
myanmarNameSort = require("myanmar-names");
```

## License

Prefixes [from Wikipedia](https://en.wikipedia.org/wiki/Burmese_names) under a Creative Commons license

Open Sourced with an MIT License
