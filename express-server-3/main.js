import express from 'express';

const app = express();

let todos = [
	{
		id: 1,
		title: 'Zajít na pivo',
		done: true,
	},
	{
		id: 2,
		title: 'Vrátit se z hospody',
		done: false,
	},
];

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	console.log('Incomming request', req.method, req.url);
	next();
});

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Todo List',
		todos: todos,
	});
});

app.get('/todo/:id', (req, res) => {
	const todo = todos.find((todo) => {
		return todo.id === Number(req.params.id)});
	res.render('todo', {
		title: 'Todo ',
		todo: todo,
	});
}); //go to todo id

app.post('/update-todo/:id', (req, res) => {
	const todo = todos.find((todo) => {
		return todo.id === Number(req.params.id)});

	todo.title = req.body.title;
	res.redirect(`/todo/${todo.id}`);

}); //update todo

app.post('/add-todo', (req, res) => {
	let i = 1;
	for (let todo of todos) {
		todo.id = i;
		i++;
	};
	const todo = {
		id: i,
		title: req.body.title,
		done: false,
	};
	todos.push(todo);
	res.redirect('/');
}); //change exist id and push new todo

app.get('/remove-todo/:id', (req, res) => {
	todos = todos.filter((todo) => {
		return todo.id !== Number(req.params.id);
	});

	res.redirect('/');
});

app.get('/toggle-todo/:id', (req, res) => {
	const todo = todos.find((todo) => {
		return todo.id === Number(req.params.id);
	});

	todo.done = !todo.done;

	res.redirect('/');
});

app.use((req, res) => {
	res.status(404);
	res.send('404 - Page not found');
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500);
	res.send('500 - Server error');
});

app.listen(8000, () => {
	console.log('Server listening on http://localhost:8000');
});
