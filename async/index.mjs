function asyncAdd(a, b) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(a + b);
		}, 1000);
	});
}

const result = asyncAdd(1, 2);

console.log(result); // Promise { <pending> }

result.then((value) => {
	console.log(value); // 3
});
