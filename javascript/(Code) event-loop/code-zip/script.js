// Synchronous Code
// Call Stack
console.log("1");
console.log("2");
console.log("3");

// Asynchronous Code
// Task Queue
console.log("1");
setTimeout(function () {
  console.log("2");
}, 0);
console.log("3");

// 1
// 2
// 3

// Asynchronous Promises Code
// Micro-task Queue
fetch("https://jsonplaceholder.typicode.com/posts")
  .then((res) => res.json())
  .then(function a(response) {
    console.log("Fetch completed:", response[0]);
  })
  .catch(function c(error) {
    console.error("Fetch error:", error);
  });

Promise.resolve().then(function b() {
  console.log("Promise resolved");
});

Promise.reject().catch(function c() {
  console.log("Promise rejected");
});

// Task Queue vs Micro-task Queue
console.log("Start");

setTimeout(() => {
  console.log("Inside Settimeout (task)");
}, 0); // Task queue

Promise.resolve().then(() => {
  console.log("Inside Promise (micro-task)");
}); // Micro Task Queue

console.log("End");

// Start
// End
// Inside Promise (micro-task)
// Inside Settimeout (task)

// ----------- Interview Questions on Event Loop -----------

// Ques 1 - What is Event Loop?
/*
  Javascript is single threaded and The event loop is responsible for how its
  asynchronous behavior happens.
  The event loop is like a traffic controller in JavaScript that manages the execution of code.
  It ensures tasks are processed in an orderly manner, handling asynchronous operations
  by continuously checking if there are pending tasks in queues(microtasks and macrotasks). 
*/

// Ques 2 - Why we need event loop to manage these task queue and microtask queue?

// Ques 3 - What is the output?

blockMainThread();

console.log("Start");

function blockMainThread() {
  const start = Date.now();
  while (Date.now() - start < 3000) {}
  console.log("running..");
}

console.log("End");

// Ques 4 - What is the output?

setTimeout(function a() {
  console.log("a");
}, 1000);

setTimeout(function b() {
  console.log("b");
}, 500);

setTimeout(function c() {
  console.log("c");
}, 0);

function d() {
  console.log("d Runs");
}

d();

// Task queue - a b c
// call stack -

// d Runs
// c
// b
// a

// Ques 5 - Whats the output?

function a() {
  for (var i = 0; i < 3; i++) {
    setTimeout(function log() {
      console.log(i); // What is logged?
    }, i * 1000);
  }
}

function a() {
  for (let i = 0; i < 3; i++) {
    setTimeout(function log() {
      console.log(i); // What is logged?
    }, i * 1000);
  }
}

// a();

// Task Queue - log() log() log()
//                0     1     2

// Ques 6 - What's the Output?

// Promise.resolve()
//   .then(function a() {
//     Promise.resolve().then(
//       setTimeout(function d() {
//         console.log("d Runs");
//       }, 0)
//     );
//     Promise.resolve().then(function e() {
//       console.log("e Runs");
//     });
//     throw new Error("Error Occured!");
//     Promise.resolve().then(function f() {
//       console.log("f Runs");
//     });
//   })
//   .catch(function b() {
//     console.log("b Runs");
//   })
//   .then(function c() {
//     console.log("c Runs");
//   });

// Task Queue -
// Micro task queue -
// Call Stack -

// e runs
// b runs
// c runs
// d runs

// Ques 7 - What's the Output?

function pause(millis) {
  return new Promise(function p(resolve) {
    setTimeout(function s() {
      resolve("resolved");
    }, millis);
  });
}

const start = Date.now();
console.log("Start");

pause(1000).then((res) => {
  const end = Date.now();
  const secs = (end - start) / 1000;
  console.log(res, ":", secs);
});

// Start
// Call Stack - pause(1000) p(resolve)
// Task - s()
// MicroTask -

// resolved: 1.3
