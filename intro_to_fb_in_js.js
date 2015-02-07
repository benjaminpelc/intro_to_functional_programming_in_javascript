/**
*	Code used in my blog post ('An Introduction to Functional Programming in JavaScript'](https://bjpelc.wordpress.com/2015/02/06/an-introduction-to-functional-programming-in-javascript/)
*	See LambdaJS at https://github.com/loop-recur/lambdajs for the functional patterns used here
*/

/*
* Imperative approach
*/

var array = [1, 2, 3, 4, 5];

var mean = 0;
// Calculate the mean, first by summing each value in the array
for (var i = 0; i < array.length; i++ ) {
	mean += array[i];
}
// And then by dividing by the number of elements in the array
mean /= array.length;

// Subtract the mean from and square each element and sum. 
var squaredVariations = 0;
for (i = 0; i < array.length; i++) {
	squaredVariations += (array[i] - mean) * (array[i] - mean);
}

// find the mean square deviation. 
var meanSquare = squaredVariations / (array.length);

// And now calculate the standard deviation by taking the square root
var std = Math.sqrt(meanSquare);

console.log(std); // >> 1.414

/*
*	Functional approach
*/

// Curry
var curry = function (fn, fnLength) {
	fnLength = fnLength || fn.length;
	return function () {
		var suppliedArgs = Array.prototype.slice.call(arguments);
		if (suppliedArgs.length >= fn.length) {
			return fn.apply(this, suppliedArgs);
		} else if (!suppliedArgs.length) {
			return fn;
		} else {
			return curry(fn.bind.apply(fn, [this].concat(suppliedArgs)), fnLength - suppliedArgs.length);
		}
	};
};

// compose
var compose = function() {
	var funcs = arguments;
	return function() {
		var args = arguments;
		for (var i = funcs.length; i --> 0;) {
			args = [funcs[i].apply(this, args)];
		}
		return args[0];
	};
};

// reduce as a curryable function
var reduce = curry(function(func, init, xs) {
	return xs.reduce(func, init);
});

// map as a curryable function
var map = curry(function(func, xs){
	return xs.map(func);
});

// length as a function
var length = function(xs) {
	return xs.length;	
};

// square a number
var square = function(x) {
	return x * x;
};

// add two numbers
var add = function(a, b) {
	return a + b;
};

// sum
var sum = reduce(add, 0);

// Simple average. Sum / length
var mean = function(xs) {
	return sum(xs) / length(xs);
};

// subtract the mean and square returning a new array
var squaredDeviations = function(xs) {
	var m = mean(xs);
	return map(function(x) {
		return square(x - m);
	}, xs);
};

// Final standard deviation function.
var std = compose(Math.sqrt, mean, squaredDeviations);

// Test it out
console.log(std([1,2,3,4,5])); // >> 1.414
 
// this is the same as:
console.log(compose(Math.sqrt, mean, squaredDeviations)([1,2,3,4,5])); // >> 1.414

// and the same as the nested implementation
console.log(Math.sqrt(mean(squaredDeviations([1,2,3,4,5]))));  // >> 1.414