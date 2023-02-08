---
title: 'Rounding percentages to add up to 100%'
date: '2022-09-11'
description: 'When floor/truncate, ceiling, and round give you sums that are too big or small.'
---

Problem: you have a collection of exact percentages that add up to 100, and you want to round them to whole numbers. However, some sets of numbers will not add up to 100 whether you round, floor, or ceiling them.

Example: `41.37 + 41.05 + 14.33 + 1.95 + 1.30 =` **`100`**

- Flooring/truncating: `41 + 41 + 14 + 1 + 1 =` **`98`**
- Ceiling: `42 + 42 + 15 + 2 + 2 =` **`103`**
- Rounding: `41 + 41 + 14 + 2 + 1 =` **`99`**

One solution to this problem is to use the [Largest Remainder method](https://www.wikiwand.com/en/Largest_remainder_method).

First you truncate each value, while preserving the decimal remainder.

| <div style="width:60px"></div> |        |
| :----------------------------- | :----- |
| `41`                           | `0.37` |
| `41`                           | `0.05` |
| `14`                           | `0.33` |
| `1`                            | `0.95` |
| `1`                            | `0.30` |

Total: `98`

Then you look at the remainders, take the biggest one, and add `1` to its truncated value.

The largest from above is `0.95`, so add `1` to the fourth number (`1` becomes `2`)

| <div style="width:60px"></div> |        |
| :----------------------------- | :----- |
| `41`                           | `0.37` |
| `41`                           | `0.05` |
| `14`                           | `0.33` |
| `2`                            |        |
| `1`                            | `0.30` |

Total: `99`

Repeat until your total is `100`.

Next largest remainder is `0.37`, so `41` becomes `42`.

| <div style="width:60px"></div> |        |
| :----------------------------- | :----- |
| `42`                           |        |
| `41`                           | `0.05` |
| `14`                           | `0.33` |
| `2`                            |        |
| `1`                            | `0.30` |

Total: `100`

This makes your final numbers `42 + 41 + 14 + 2 + 1 = 100`

Here's an example of the implementation for a collection of star ratings:

```js
const ratings = {
  five: 294,
  four: 193,
  three: 23,
  two: 11,
  one: 9,
}

function calcPercentages(ratings) {
  const totalRatings = sumValues(ratings)

  const truncated = Object.keys(ratings).reduce((acc, curr) => {
    acc[curr] = Math.trunc((ratings[curr] / totalRatings) * 100)
    return acc
  }, {})

  const decimals = Object.entries(ratings)
    .map(entry => {
      entry[1] = ((entry[1] / totalRatings) * 100) % 1
      return entry
    })
    .sort((a, b) => b[1] - a[1])

  let totalPercentage = sumValues(truncated)

  let i = 0
  while (totalPercentage < 100 && i < decimals.length) {
    truncated[decimals[i][0]]++
    totalPercentage++
    i++
  }

  return truncated
}

function sumValues(obj) {
  return Object.values(obj).reduce((acc, curr) => acc + curr, 0)
}
```
