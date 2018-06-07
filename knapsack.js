const fs = require("fs");

/* 
=====  Naive Recursive Approach =====
=====  "Brute force" method =====
*/
function naiveKnapsack(items, capacity) {
  function recurse(i, size) {
    // Base case
    if (i === -1) {
      return {
        value: 0,
        size: 0,
        chosen: []
      };
    }

    // Check to see if item fits
    else if (items[i].size > size) {
      return recurse(i - 1, size);
    }
    // Item fits, but might not be worth as much as items in knapsack already
    else {
      const r0 = recurse(i - 1, size);
      const r1 = recurse(i - 1, size - items[i].size);

      r1.value += items[i].value;

      if (r0.value > r1.value) {
        return r0;
      } else {
        r1.size += items[i].size;
        r1.chosen = r1.chosen.concat(i + 1);
        return r1;
      }
    }
  }
  return recurse(items.length - 1, capacity);
}

/*
  Greedy Strategy
*/

const greedyAlgo = (items, capacity) => {
  const result = {
    size: 0,
    value: 0,
    chosen: []
  };

  //   items = items.filter(item => item.size < capacity);
  //   console.log(items);
  items.sort((i1, i2) => {
    const r1 = i1.value / i1.size;
    const r2 = i2.value / i2.size;

    return r2 - r1;
  });

  // Loop through out items array, checking to see if the
  // item's size <= our total capacity
  for (let i = 0; i < items.length; i++) {
    if (items[i].size <= capacity) {
      // if it is, add it to our final result
      result.size += items[i].size;
      results.value += items[i].value;
      results.chosen.push(items[i].index);
      // dont forget to decrement our total capacity
      capacity -= items[i].size;
    }
  }

  return result;
};

const argv = process.argv.slice(2);

if (argv.length != 2) {
  console.error("usage: filename capacity");
  process.exit(1);
}

const filename = argv[0];
const capacity = parseInt(argv[1]);

// Read the file
const filedata = fs.readFileSync(filename, "utf8");

// Split filedata on each new line
const lines = filedata.trim().split(/[\r\n]+/g);

// Process the lines
const items = [];

for (let l of lines) {
  const [index, size, value] = l.split(" ").map(n => parseInt(n));

  items.push({
    index: index,
    size: size,
    value: value
  });
}
