---
title: JS fixture with four defects
---
A fixture lesson for tests/validate-js.test.js: each section below holds one defect the validator must report — a wrong output block, a program that never finishes, a syntax error and a pin nothing refers to.

## Wrong output

```js run
console.log(1 + 1);
```

```output
3
```

## Never ends

```js run
setInterval(() => {}, 10);
```

## Typo

```js run
conso le.log(1);
```

## Unreferenced pin

```js pin lonely.js
const a = 1;
const b = 2;
```

Nothing here quotes the code above.
