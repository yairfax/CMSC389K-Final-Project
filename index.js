var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require("./data-util");
var _ = require('underscore');
var Language = require('./models/Language');
var mongoose = require('mongoose')
var dotenv = require('dotenv');
const features = ['Object Oriented', 'Scripting', 'Low Level', 'High Level', 'Functional', 'Imperative', 'Dynamically Typed', 'Statically Typed'];
const levels = ['Beginner', 'Intermediate', 'Expert'];
const compatibility = ['macOS', 'Windows', 'Linux'];

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: 'views/partials/'}));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

//MongoDB
dotenv.load()
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true })
mongoose.connection.on('error', function(err) {
	console.log("Connection was unable to take place")
	process.exit(1);
});

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5 
 * endpoints for the API, and 5 others. 
 */

app.get("/", function(req, res) {
	Language.find({}, function(err, langs) {
		if (err) throw err;

		res.render('home', {
			langs: langs
		});
	})
})

app.get("/name", function(req, res) {
	Language.find({}, function(err, langs) {
		if (err) throw err;

		res.render('selector', {
			head: 'Select a Language',
			list: _.pluck(langs, 'name'),
			path: '/name/'
		})
	})
})

app.get("/compat", function(req, res) {
	res.render('selector', {
		head: 'Select a System',
		list: compatibility,
		path: '/compat/'
	})
})

app.get("/compat/:feat", function(req, res) {
	Language.find({compatibility: `${req.params.feat}`}, function(err, langs) {
		if (err) throw err;
		if (!langs) return res.send("Houston, we have a problem");
		res.render('home', {
			langs: langs,
			filter: req.params.feat
		})
	})
})

app.get("/name/:lang", function(req, res) {
	Language.findOne({id_name: req.params.lang.toLowerCase()}, function(err, lang) {
		if (!lang) return res.send("Please send a valid language");
		res.render('language', {
			lang: lang
		})
	})
})

app.get("/features", function(req, res) {
	res.render('selector', {
		head: 'Select a Feature',
		list: features,
		path: '/features/'
	})
})

app.get("/features/:feat", function(req, res) {
	Language.find({features: req.params.feat}, function(err, langs) {
		if (err) throw err;
		if (!langs) return res.send("Houston, we have a problem");
		res.render('home', {
			langs: langs,
			filter: req.params.feat
		})
	})
})

app.get("/alphebetize", function(req, res) {
	Language.find({}, function(err, langs) {
		if (err) throw err;

		res.render('home', {
			langs: _.sortBy(langs, function(elt) {return elt.name})
		});
	})
})

app.get("/rating", function(req, res) {
	Language.find({}, function(err, langs) {
		if (err) throw err;

		res.render('home', {
			langs: _.sortBy(langs, function(elt) {return -elt.avg_rating})
		});
	})
})

app.get("/newlanguage", function(req, res) {
	res.render('new-language', {
		features: features,
		compatibility: compatibility
	})
})

app.get("/name/:lang/newreview", function(req, res) {
	Language.findOne({id_name: req.params.lang.toLowerCase()}, function(err, lang) {
		if (err) throw err;
		if(!lang) return res.send("Send a valid language")

		res.render('new-review', {
			lang: lang,
			levels: levels
		})
	})
})

app.get("/lucky", function(req, res) {
	Language.find({}, function(err, langs) {
		if (err) throw err;
		lang = _.sample(langs)
		res.redirect(`/name/${lang.id_name}`)
	})
})

/***************************/
/*********** API ***********/
/***************************/

// helper
function avg(arr) {
	var sum = 0.0;
	for (var i of arr)
		sum += i;
	return sum/arr.length;
}


app.post("/api/name/:lang/newreview", function(req, res) {
	var sub = req.body;
	sub.date_posted = new Date();
	Language.findOne({id_name: req.params.lang.toLowerCase()}, function(err, lang) {
		if (!lang) return res.send("Send a valid language");
		var reviews = lang.reviews
		reviews.push(sub)
		var newrating = avg(_.pluck(reviews, 'rating'));
		Language.findOneAndUpdate({id_name: req.params.lang.toLowerCase()}, {$push: {'reviews': sub}, avg_rating: newrating}, function(err, lang) {
			if (err) throw err;
			res.redirect(`/name/${req.params.lang}`)
		})
	})
})

app.post("/api/newlanguage", function(req, res) {
	var sub = req.body
	sub.id_name = sub.name.toLowerCase();
	var newLang = new Language(sub)
	newLang.save(function (err) {
		if (err) throw err;
	})
	res.redirect('/')
})

app.delete('/api/name/:lang/delete', function(req, res) {
	Language.findOneAndDelete({id_name: req.params.lang.toLowerCase()}, function(err, data) {
		if (err) throw err;
		if (!data) res.send('Send a valid language!')
		res.send('Success!')
	})
})

app.get('/api/getAllLangs', function(req, res) {
	Language.find({}, function(err, langs) {
		if (err) throw err;

		res.json(langs)
	})
})

app.get('/api/:lang', function(req, res) {
	Language.findOne({id_name: req.params.lang.toLowerCase()}, function(err, lang) {
		if (err) throw err;

		res.json(lang)
	})
})

app.get('/api/:lang/reviews', function(req, res) {
	Language.findOne({id_name: req.params.lang.toLowerCase()}, function(err, lang) {
		if (err) throw err;
		res.json(lang.reviews)
	})
})

app.listen(process.env.PORT || 3000, function() {
    console.log('Language Forum listening on port 3000!');
});
