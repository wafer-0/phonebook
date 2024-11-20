require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Person = require("./models/person")
// const { default: persons } = require("../frontend/src/services/persons")

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
	return "hello"
})

// mongodb data
app.get("/api/persons", (request, response) => {
	Person.find({}).then((result) => response.json(result))
})

// mongodb data
app.post("/api/persons", (request, response, next) => {
	const { name, number } = request.body
	const person = new Person({
		name: String(name),
		number: String(number),
	})

	person
		.save()
		.then((person) => {
			console.log(`add ${person.name} ${person.number} to phonebook`)
			response.json(person)
		})
		.catch((error) => {
			next(error)
		})
})

// mongodb data
app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => {
			next(error)
		})
})

app.put("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndUpdate(request.params.id, request.body, {
		new: true,
		runValidators: true,
	})
		.then((updatePerson) => {
			response.json(updatePerson)
		})
		.catch((error) => {
			next(error)
		})
})

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then((result) => {
			if (result != null) {
				response.json(result)
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => {
			next(error)
		})
})

// mongodb data
app.get("/info", (request, response) => {
	Person.countDocuments({}).then((cnt) => {
		const time = Date(Date.now())
		response.send(
			`<p>Phonebook has info for ${cnt} people</p><p>${time}</p>`
		)
	})
})

const errorHandler = (error, request, response, next) => {
	console.error(error)
	if (error.name == "CastError") {
		return response.status(400).send({ error: "malformatted id" })
	} else if (error.name == "ValidationError") {
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
