const express = require('express');

const port = 8000;

const app = express();

// get - HTTP metoda GET (může být i .post .patch .put .delete nebo univerzální .use)
// / - url pro kterou se zavolá callback
app.get('/', (req, res) => {
	// send automaticky nastaví Content-Type dle nejlepšího odhadu
	res.send('<h1>Hello, Worlds!</h1>');
});

app.post('/', (req, res) => {
	// send automaticky nastaví Content-Type dle nejlepšího odhadu
	res.send('<h1>POST</h1>');
});
app.delete('/', (req, res) => {
	// send automaticky nastaví Content-Type dle nejlepšího odhadu
	res.send('<h1>DELETE</h1>');
});
app.put('/', (req, res) => {
	// send automaticky nastaví Content-Type dle nejlepšího odhadu
	res.send('<h1>PUT</h1>');
});

app.get('/json', (req, res) => {
	// Express automaticky nastavi spravne content-type a serialzuje objekt do JSONu
	res.send({ firstName: 'Franta', lastName: 'Sádlo' });
});

// :name reprezentuje dynamický parametr
// /hello/Franta - projde
// /hello/Lojza - projde
// /hello - neprojde
// /hello/Pepa/Zdepa - neprojde
app.get('/hello/:name', (req, res) => {
	const name = req.params.name;

	res.send(`<h1>Hello, ${name}!</h1>`);
});

// Univerzální handler který zachytí všechny požadavky,
// které nezachytili handlery výše a zobrazí 404

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
