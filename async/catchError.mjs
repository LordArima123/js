function asyncAdd(a, b) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (a + b === 7) {
				reject('Ko thich so 7');
			}

			resolve(a + b);
		}, 1000);
	});
}

const result = asyncAdd(1, 2);

console.log(result); // Promise { <pending> }

result
	.then((value) => {
		console.log('Res 1:', value); // 3
		return asyncAdd(value, 4);
	})
	.then((val) => {
		console.log('Res 2:', val); // 7
		return asyncAdd(val, 4);
	})
	.then((val) => {
		console.log('Res 3:', val); // 11
	})
	.catch((error) => {
		console.log('Loi', error);
	});
