const mongoose = require("mongoose")

const argvLen = process.argv.length

if (argvLen < 3) {
	console.log("give password as argument")
	process.exit(1)
}

if (argvLen != 3 && argvLen != 5) {
	console.log("invalid command")
	process.exit(1)
}

const password = process.argv[2]

const db = "phonebook"

const url = `mongodb+srv://xyzhang722:${password}@cluster0.vwhca.mongodb.net/${db}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model("Person", personSchema)

if (argvLen == 5) {
	const name = process.argv[3]
	const number = process.argv[4]

	const person = new Person({
		name: name,
		number: number,
	})
	person.save().then((result) => {
		console.log(`added ${result.name} ${result.number} to phonebook`)
		mongoose.connection.close()
	})
} else if (argvLen == 3) {
	Person.find({}).then((result) => {
		console.log(`${db}:`)
		result.map((person) => {
			console.log(`${person.name} ${person.number}`)
		})

		mongoose.connection.close()
	})
}
