import fs from 'fs';

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
	for(let i = 1; i<5; i++){
		const content = 'Hello'
		await writeFile(`output${i}.txt`, content)
	}
} catch (error) {
	console.log('error, ',error);
}