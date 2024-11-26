const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
    .connect(url)

    .then((result) => {
        console.log('conneced to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    number: {
        type: String,
        validate: {
            validator: (number) => {
                return /^\d{2,3}-\d+$/.test(number)
            },
            message: (props) => {
                // Console.log(props)
                return `${props.value} is not a valid phone number!`
            },
        },
        required: [true, 'Phone number required'],
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = mongoose.model('Person', personSchema)
