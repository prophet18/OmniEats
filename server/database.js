const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // add datbase link
        await mongoose.connect('mongodb+srv://username:k4RdwXTN26KyYvxI@cluster0.hz1ahth.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // connected to DB
        console.log('Connected to database')
    } catch (error) {
        // error connecting to DB
        console.log('Error connecting to database')
    }
};

const businessSchema = new mongoose.Schema({
    name: { type: String, required: false },
    address: { type: String, required: false },
    dd_rating: { type: Number, required: false },
    gh_rating: { type: Number, required: false },
    ue_rating: { type: Number, required: false },
});

const Business = mongoose.model('Business', businessSchema);

const models = {
    Business: Business,
  };

module.exports = { connectDB, models };