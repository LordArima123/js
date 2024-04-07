import chalk from 'chalk';
import http from 'http';

const port = 8000;

const server = http.createServer((req, res) => {
	console.log('request');
	console.log('  url', req.url);
	console.log('  method', req.method);

	const name = req.url.slice(1) || 'World';

	res.statusCode = 200; // OK
	res.setHeader('Content-Type', 'text/html');
	res.write(`<h1>Hello, ${name}!<h1>`);
	res.end();
});

server.listen(port, () => {
	console.log(chalk.red(`Server listening at http://localhost:${port}`));
});
