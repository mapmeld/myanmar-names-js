# myanmar-names.js

Sort a list of Myanmar language names using JavaScript

Removes prefixes and sorts by official alphabetic order (yes, you will need a
  library for this)

**No, it will not work in NodeJS** - this library requires the Intl.Collator API, which
does not come with NodeJS or the Intl npm module.

For more information, see [Joyent's instructions](https://github.com/joyent/node/wiki/Intl) for
building NodeJS with Intl support.

## Usage

```javascript
myanmarNameSort([
  "ဦးလှမြင့်",
  "ဦးမော"
]);
> ["ဦးမော", "ဦးလှမြင့်"]
```

## License

Prefixes [from Wikipedia](https://en.wikipedia.org/wiki/Burmese_names) under a Creative Commons license

Open Sourced with an MIT License
