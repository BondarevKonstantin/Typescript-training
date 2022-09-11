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
    // console.log('Cleaning up');
  }
}

const fibonacciIterator = fibonacciGenerator();

for (let i of fibonacciIterator) {
  // console.log(i);
  // 1 1 2 3 5 8 13 21 34 55 Cleaning up

  if (i > 50) {
    // We don't need the "break" command here
    fibonacciIterator.return();
  }
}

// =================================================
//            Generators are iterative
// =================================================

function* iterativeGenerator() {
  yield 1;
  const message = 'Any code works when generator is iterating!';
  yield 2;
  // console.log(message);
  yield 3;
}

const newSequence = [0, ...iterativeGenerator(), 4]; // Any code works when generator is iterating!
// console.log(newSequence); // [0, 1, 2, 3, 4]

// Now we can use this to set some new interfaces

const genRange = {
  from: 1,
  to: 10,
  *[Symbol.iterator]() {
    for (let value = this.from; value <= this.to; value++) {
      yield value;
    }
  },
};

// console.log(...genRange); // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

// =================================================
//            Async work with generators
// =================================================

// This function is indended to mimic the "fetch" function

type ServerData = {
  subject: string;
};

const fakeFetch = (isGoodResponse: boolean = true): Promise<ServerData> =>
  new Promise((resolve, reject) => {
    const serverData: ServerData = { subject: 'generators' };
    const errorMessage = 'Could not fetch data from the server';

    if (isGoodResponse) setTimeout(() => resolve(serverData), 1000);
    else setTimeout(() => reject(errorMessage), 1000);
  });

// Let's try to recreate async/await feautre with generators

function* simpleAsyncGenerator(): Generator<Promise<ServerData>> {
  try {
    // Yield promise to the variable below to continue the sync code after it resolves
    const fetchedSubject = yield fakeFetch();
    // Couldn't have done console log without generators or async/await
    // console.log(fetchedSubject); // { subject: 'generators' }
  } catch (err) {
    // console.error(err); // Could not fetch data from the server
  }
}

const simpleAsyncIterator = simpleAsyncGenerator();
const simplePromise = simpleAsyncIterator.next().value;

simplePromise
  .then((fetchedData: { subject: string }) => {
    simpleAsyncIterator.next(fetchedData);
  })
  .catch((err: Error) => simpleAsyncIterator.throw(err));

// =================================================
//                Yield delegation
// =================================================

// Now let's go for some wtf stuff

function* innerDelegationGenerator() {
  console.log('Inner delegation function started');
  yield 2;
  yield 3;
  console.log('Inner delegation function finished');
}

function* outerDelegationGenerator() {
  yield 1;
  // Fall in the other generator
  yield* innerDelegationGenerator(); // Also works with any other iterator - [2, 3]
  // Back here when the other generator is done
  yield 4;
}

const delegationIterator = outerDelegationGenerator();
delegationIterator.next().value; // 1
delegationIterator.next().value; // Start, 2
delegationIterator.next().value; // 3, finish
delegationIterator.next().value; // 4
