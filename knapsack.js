const fs = require("fs");

/* 
=====  Naive Recursive Approach =====
  "Brute force" method
  Super ineffective
*/
function naiveKnapsack(items, capacity) {
  function recurse(i, size) {
    // Base case
    if (i === -1) {
      return {
        value: 0,
        size: 0,
        chosen: [],
        msg: "naiveKnapsack"
      };
    }

    // Check to see if item fits
    // if no, move on to next item
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
=====  Memoized Recursive Approach =====
  Save results in cache to reduce runtime
  Faster!
*/
function memoizedKnapsack(items, capacity) {
  //Initialize cache (matrix, 2d array)
  const cache = Array(items.length);

  //Add second dimension
  for (let i = 0; i < items.length; i++) {
    cache[i] = Array(capacity + 1).fill(null);
  }

  function recurseMemo(i, size) {
    let value = cache[i][size];

    if (!value) {
      value = recurseNaive(i, size);
      cache[i][size] = value;
    }

    return value;
  }

  function recursiveNaive(i, size) {
    // Base case
    if (i === -1) {
      return {
        value: 0,
        size: 0,
        chosen: [],
        msg: "memoizedKnapsack"
      };
    }

    // Check to see if item fits
    // if no, move on to next item
    else if (items[i].size > size) {
      return recurseMemo(i - 1, size);
    }
    // Item fits, but might not be worth as much as items in knapsack already
    else {
      const r0 = recurseMemo(i - 1, size);
      const r1 = recurseMemo(i - 1, size - items[i].size);

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

// ===== Fail memoizing =====
//   function knapsackMemo(i, size) {
//     let value = cache[i][size];
//   }
//   function recurse(i, size) {
//     if (!cache) {
//       return cache;
//     }
//   }
  return recurseMemo(items.length - 1, capacity);
}

/*
=====  Greedy Strategy =====
  0. Go through our items and filter out any items whose size > knapsack's capacity
  1. 'Score' each item by determining it's value/weight ratio
  2. Sort the items array by each item's ratio such that the items with the best ratio
  are at the top of the array of items
  3. Grab items off the top of the items array until we reach our knapsack's full capacity
*/

const greedyAlgo = (items, capacity) => {
  const result = {
    size: 0,
    value: 0,
    chosen: [],
    msg: "greedyAlgo"
  };

  //   items = items.filter(item => item.size < capacity);
  //   console.log(items);
  items.sort((i1, i2) => {
    const r1 = i1.value / i1.size;
    const r2 = i2.value / i2.size;

    return r2 - r1;
  });

  // Loop through our items array, checking to see if the
  // item's size <= our total capacity
  for (let i = 0; i < items.length; i++) {
    if (items[i].size <= capacity) {
      // if it is, add it to our final result
      result.size += items[i].size;
      result.value += items[i].value;
      result.chosen.push(items[i].index);
      // dont forget to decrement our total capacity
      capacity -= items[i].size;
    }
  }

  return result;
};

/* 
=====  Bottom Up Iterative =====
*/

//   function bottomUp(items, capacity) {
//     let cache = Array(items.length);
//   }

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

console.log(naiveKnapsack(items, capacity));
console.log(memoizedKnapsack(items, capacity));
console.log(greedyAlgo(items, capacity));
