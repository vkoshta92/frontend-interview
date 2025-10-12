// VAR, LET & CONST Interview Questions

// Question 1 : Variable Shadowing

function test() {
  let a = "Hello";

  if (true) {
    let a = "Hello"; // New value assigned
    console.log(a);
  }

  console.log(a);
}

test();

// Question 2 :  Illegal Shadowing

function func() {
  var a = "Hello";
  let b = "Namaste";

  if (true) {
    let a = "Hi"; // Legal Shadowing
    var b = "Bye"; // Illegal Shadowing
    console.log(a); // It will print 'GeeksforGeeks'
    console.log(b); // It will print error
  }
}
test();

// Question 3 : Hoisting

console.log(a);

var a = 10;

// Question 4 : Temporal Dead Zone

console.log(a, b, c);

const c = 30;
let b = 20;
var a = 10;
