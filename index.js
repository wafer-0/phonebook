const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
]

app.use(cors())
app.use(express.json())
app.use(express.static("dist"))
morgan.token("body", (request, response) => {
	const bodyStr = JSON.stringify(request.body)
	return bodyStr
})
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :body"
	)
)

app.get("/", (request, response) => {
	response.send("<p>hello<p/>")
})

app.get("/api/persons", (request, response) => {
	response.json(persons)
})

app.post("/api/persons", (request, response) => {
	const { name, number } = request.body
	const exist = persons.find((person) => person.name === name)
	let msg = {}
	if (name && number && !exist) {
		// no error
		const newId = Math.floor(Math.random() * 100)
		const newPerson = {
			id: String(newId),
			name: String(name),
			number: String(number),
		}
		persons = persons.concat(newPerson)
		return response.json(persons)
	} else {
		if (exist) {
			msg = { error: "name must be unique" }
		} else if (!name || !number) {
			let prob = []
			if (!name) {
				prob.push("name")
			}
			if (!number) {
				prob.push("number")
			}
			const probStr = prob.join(" & ")
			msg = { error: `${probStr} missing` }
		}
		response.status(400).json(msg)
	}
})

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id
	const person = persons.find((person) => person.id === id)
	if (person) {
		return response.json(person)
	} else {
		response.status(404).end()
	}
})

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id
	persons = persons.filter((person) => person.id != id)
	response.json(persons)
})

app.get("/info", (request, response) => {
	const cnt = persons.length
	const time = Date(Date.now())
	response.send(`<p>Phonebook has info for ${cnt} people</p><p>${time}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
