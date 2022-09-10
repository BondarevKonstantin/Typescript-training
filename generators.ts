// =================================================
//            Some value generating ideas
// =================================================

// Let's say, we have IIFE with only one reason
// to increment the value, when the function is invoked

const IIFEFibonacciCounter = (function () {
  let prevValue = 0;
  let value = 0;

  return function () {
    if (value === 0) {
      return ++value;
    }

    [prevValue, value] = [value, value + prevValue];

    return value;
  };
})();

for (let i = 0; i < 10; i++) {
  IIFEFibonacciCounter(); // 1 1 2 3 5 8 13 21 34 55
}

// Now let's try to recreate generators ourselves and build this function again

const selfmadeFibonacciGenerator = (function () {
  let prevValue = 0;
  let value = 0;

  return {
    [Symbol.iterator]() {
      return this;
    },

    // Recreating generator methods
    next: function () {
      if (value === 0) {
        value++;
        return { done: false, value };
      }

      [prevValue, value] = [value, value + prevValue];

      return { done: false, value };
    },
  };
})();

for (let i = 0; i < 10; i++) {
  // selfmadeFibonacciGenerator.next().value;
  // 1 1 2 3 5 8 13 21 34 55
}

// Now let's check iterator, that we created to loop through values

for (let i of selfmadeFibonacciGenerator) {
  if (i > 80) break;

  // console.log(i);
  // 1 1 2 3 5 8 13 21 34 55
}

// We can pass that job to a real GIGACHAD - let's talk generators

function* fibonacciGenerator() {
  try {
    let prevValue = 0;
    let value = 0;

    while (true) {
      if (value === 0) {
        yield ++value;
      }

      [prevValue, value] = [value, value + prevValue];

      yield value;
    }
  } finally {
    console.log('Cleaning up');
  }
}

const fibonacciIterator = fibonacciGenerator();

for (let i of fibonacciIterator) {
  console.log(i);

  if (i > 50) {
    // We don't need the "break" command here
    fibonacciIterator.return();
  }
  // 1 1 2 3 5 8 13 21 34 55 Cleaning up
}
