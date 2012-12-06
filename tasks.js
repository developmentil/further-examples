var further = require('further'),

// Create a simple timeout task
timerTask = function(timeout, name, result) {
	name = name || ('timerTask' + timeout);
	
	return function(callback) {
		console.log('Timer task "' + name + '" started... (timeout: ' + timeout + ')');
		
		setTimeout(function() {
			console.log('Timer task "' + name + '" ended.');
			
			callback.apply(this, result || [null, name]);
		}, timeout);
	};
};

// Serial
console.log('Create serial task: "t1".');
var t1 = new further.Serial();

console.log('t1: Push task "t1-n1".');
t1.push(timerTask(100, 't1-n1'));

console.log('t1: Push task "t1-n2" with "secound" key.');
t1.push('secound', timerTask(50, 't1-n2', [null, 1, 2, 3]));

console.log('t1: Push tasks "t1-n3" and "t1-n4" with keys "3rd" and "4th".');
t1.push({
	'3rd': timerTask(200, 't1-n3'),
	'4th': timerTask(10, 't1-n4')
});

// Parallel
console.log('Create parallel task: "t2".');
var t2 = new further.Parallel();

console.log('t2: Push task "t2-timer-100".');
t2.push(timerTask(100, 't2-timer-100'));

console.log('t2: Push task "t2-timer-50".');
t2.push(timerTask(50, 't2-timer-50', [null, 1, 2, 3]));

console.log('t2: Create a next function with 500m timeout.');
setTimeout(t2.next(), 500);


console.log('t1: Run.');
t1.run(function(err, results) {
	console.log('t1: Finished with the arguments [err, results]:');
	console.log([err, results]);
});
console.log('t1: Waiting for finish...');

console.log('t2: Run.');
t2.run(function(err, results) {
	console.log('t2: Finished with the arguments [err, results]:');
	console.log([err, results]);
});
console.log('t2: Waiting for finish...');
