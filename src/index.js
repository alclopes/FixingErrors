const express = require('express');

// Fix include version UUID (15/09/2021 18:40)
const { v4: uuidv4, validate } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

// retorna uma lista contendo todos os repositórios cadastrados.
app.get('/repositories', (request, response) => {
	// Fix include check to exist some repository (15/09/2021 17:57)
	if (repositories === []) {
		return response.status(400).json({ error: 'List of Repository is empty!' });
	}

	return response.json(repositories);
});

// Cria um repositório
app.post('/repositories', (request, response) => {
	const { title, url, techs } = request.body;

	const repository = {
		id: uuidv4(),
		title,
		url,
		techs,
		likes: 0,
	};

	// Fix include validate to id (15/09/2021 17:46)
	if (!validate(repository.id)) {
		return response.status(400).json({ error: "Id isn't valid UUID" });
	}

	// Fix insert new repository in repositories(15/09/2021 17:47)
	repositories.push(repository);

	// Fix status 201 (15/09/2021 17:20)
	return response.status(201).json(repository);
});

// Altera dados do repositorio - Metodo01
app.put('/repositories/:id', (request, response) => {
	const { id } = request.params;

	// Fix RepositoryBody to Update (15/09/2021 17:23)
	// const updatedRepository = request.body;
	const { title, url, techs } = request.body;

	const repository = repositories.find((repository) => repository.id === id);

	if (!repository) {
		return response.status(404).json({ error: 'Repository not found' });
	}

	// Fix Change only what received (15/09/2021 18:15)
	if (typeof title !== 'undefined') {
		repository.title = title;
	}
	if (typeof url !== 'undefined') {
		repository.url = url;
	}
	if (typeof techs !== 'undefined') {
		repository.techs = techs;
	}

	return response.json(repository);
});

// Altera dados do repositorio - Metodo02
app.put('/repositories2/:id', (request, response) => {
	const { id } = request.params;
	const { title, url, techs } = request.body;

	const repositoryIndex = repositories.findIndex(
		(repository) => repository.id === id
	);

	if (repositoryIndex < 0) {
		return response.status(404).json({ error: 'Repository not found' });
	}

	const repository = { ...repositories[repositoryIndex], title, url, techs };

	repositories[repositoryIndex] = repository;

	return response.json(repository);
});

// apaga repositorio
app.delete('/repositories/:id', (request, response) => {
	const { id } = request.params;

	repositoryIndex = repositories.findIndex(
		(repository) => repository.id === id
	);

	// Fix return of findIndex for -1 (15/09/2021 17:30)
	if (repositoryIndex < 0) {
		return response.status(404).json({ error: 'Repository not found' });
	}

	repositories.splice(repositoryIndex, 1);

	return response.status(204).send();
});

// contabiliza e retorna a quantidade de likes
app.post('/repositories/:id/like', (request, response) => {
	const { id } = request.params;

	const repository = repositories.find((repository) => repository.id === id);

	if (!repository) {
		return response.status(404).json({ error: 'Repository not found' });
	}

	// Fix increment to likes (15/09/2021 17:38)
	repository.likes++;

	return response.json(repository);
});

module.exports = app;
