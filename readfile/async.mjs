import fs from 'fs/promises';

/* function readFile(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}*/

const readFile = async (path) => {
	return fs.readFile(path, (err, data) => {
		if (err) {
			return err;
		} else {
			return data.toString();
		}
	});
};

const writeFile = async (path, data) => {
	return fs.writeFile(path, data, (err) => {
		if (err) {
			return err;
		} else {
			return data;
		}
	});
};

try {
	const input = await readFile('text.txt');

	const output = input + ', i love javascript';
	for (let i = 1; i < 5; i++) {
		await writeFile(`output${i}.txt`, output);
	}
} catch (error) {
	console.log('error, ', error);
}
