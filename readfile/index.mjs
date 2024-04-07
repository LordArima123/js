import fs, { read } from 'fs';

function readFile(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

function writeFile(path, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, data, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

// hello world, i love javascript
let text = ', i love javascript';
const read_text = readFile('text.txt');
read_text
	.then((data) => {
		text = data + text;
		writeFile('text.txt', text)
			.then(() => {
				console.log('Written!');
			})
			.catch((err) => {
				console.log(err);
			});
	})
	.catch((error) => {
		console.log(error);
	});
