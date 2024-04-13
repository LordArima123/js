import express from 'express';
import knex from "knex";
import knexfile from './knexfile.js';

const app = express();
const db = knex(knexfile);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	console.log('Incomming request', req.method, req.url);
	next();
});

app.get('/', async (req, res) => {
	const todos = await db('todos').select("*");
	console.log(todos);
	res.render('index', {
		title: 'Todo List',
		todos: todos,
	});
});

app.get('/todo/:id', async (req, res) => {
	const todos = await db('todos').select("*");
	const todo = todos.find((todo) => {
		return todo.id === Number(req.params.id)});
	res.render('todo', {
		title: 'Todo ',
		todo: todo,
	});
}); //go to todo id

app.post('/update-todo', async (req, res) => {
	const todos = await db('todos').select("*");

	const todo = todos.find((todo) => {
		return todo.id === Number(req.body.id);
	});

	if (!todo || !todo.id || !todo.title) {
		return res.redirect('/');
	}
	console.log(todo);
	db('todos').select("id","title").where({id:todo.id}).set("title",todo.title);
	todo.title = body.title;
	res.redirect(`/todo/${todo.id}`);
}); //update todo


app.post('/add-todo',async (req, res) => {
	const todo = {
		title: req.body.title,
		done: false,
	}

	await db('todos').insert(todo);
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

