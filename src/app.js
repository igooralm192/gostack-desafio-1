const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateUuid = (req, res, next) => {
	const { id } = req.params

	if (!isUuid(id)) {
		return res.status(400).send({ error: 'Repository ID is incorrect.' })
	}

	return next()
}

app.use('/repositories/:id', validateUuid)

app.get("/repositories", (request, response) => {
	return response.json(repositories)
});

app.post("/repositories", (request, response) => {
	const { title, url, techs } = request.body

	const repository = { id: uuid(), title, url, techs, likes: 0 }
	repositories.push(repository)

	return response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
	const { id } = request.params
	const { title, url, techs } = request.body

	const index = repositories.findIndex(rep => rep.id === id)

	if (index < 0) {
		return response.status(400).send({ error: 'Repository not found.' })
	}

	repositories[index] = { ...repositories[index], title, url, techs }

	return response.status(200).json(repositories[index])
});

app.delete("/repositories/:id", (request, response) => {
	const { id } = request.params

	const index = repositories.findIndex(rep => rep.id === id)

	if (index < 0) {
		return response.status(400).send({ error: 'Repository not found.' })
	}

	repositories.splice(index, 1)

	return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params

	const index = repositories.findIndex(rep => rep.id === id)

	if (index < 0) {
		return response.status(400).send({ error: 'Repository not found.' })
	}

	repositories[index].likes += 1

	return response.status(200).json(repositories[index])
});

module.exports = app;
