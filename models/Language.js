var mongoose = require('mongoose')

var reviewSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true
	},
	comment: String,
	date_posted: {
		type: Date,
		required: true
	},
	occupation: {
		type: String,
		required: true
	},
	experience: {
		type: String,
		enum: ['Beginner', 'Intermediate', 'Expert'],
		required: true
	}
});

var languageSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	id_name: {
		type: String,
		required: true
	},
	features: {
		type: [String],
		enum: ['Object Oriented', 'Scripting', 'Low Level', 'High Level', 'Functional', 'Imperative', 'Dynamically Typed', 'Statically Typed']
	},
	docs_link: {
		type: String,
		required: true
	},
	avg_rating: {
		type: Number,
		min: 0,
		max: 5,
		required: true
	},
	compatibility: {
		type: [String],
		enum: ['macOS', 'Windows', 'Linux'],
		required: true
	},
	reviews: [reviewSchema]
});

var Language = mongoose.model('Language', languageSchema);

module.exports = Language;