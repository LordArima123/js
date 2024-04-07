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
