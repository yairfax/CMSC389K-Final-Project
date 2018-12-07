
# The Language Forum

---

Name: Yair Fax

Date: 3 December 2018

Project Topic: Programming Language Forum

URL: https://language-forum.herokuapp.com

---


### 1. Data Format and Storage

#### Language Data:
Data point fields:
- `name`: `Type: String`
- `features`: `Type: [String]`
- `docs_link`: `Type: String`
- `avg_rating`: `Type: Number`
- `compatibility`: `Type: [String]`
- `reviews`: `Type: [ReviewSchema] (see below)`

Schema:
```javascript
{
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
}
```


#### Review Data:
Data point fields:
- `user`: `Type: String`
- `rating`: `Type: Number`
- `comment`: `Type: String`
- `occupation`: `Type: String`
- `experience`: `Type: String`
- `date_posted`: `Type: Date`

Schema: 
```javascript
{
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
}
```


### 2. Add New Data

#### New Language
HTML form route: `/newlanguage`

POST endpoint route: `/api/newlanguage`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/newlanguage',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       name: 'JavaScript',
       features: ["Object Oriented", "Scripting", "High Level", "Functional"],
       docs_link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
       compatibility: ["macOS", "Windows", "Linux"],
       avg_rating: 4 /*This will change when reviews are submitted*/
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

#### New Review for a Language
HTML form route: `/name/:lang/newreview`

POST endpoint route: `/api/name/:lang/newreview`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/name/javascript/newreview',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       user: 'Yair Fax',
       experience: 'Intermediate',
       occupation: 'Student',
       rating: 4,
       comment: 'I like JavaScript. It treats first class functions really well'
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint routes: `/api/getAllLangs`, `/api/:lang`, `api/:lang/reviews`

### 4. Search Data

Search Field: Name

### 5. Navigation Pages

Navigation Filters
1. Alphebetize -> `/alphebetize`
2. Sort By Rating -> `/rating`
3. Compatibility -> `/compat`
4. Feature -> `/features`
5. I'm Feeling Lucky! -> `/lucky`

