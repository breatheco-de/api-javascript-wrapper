# BreatheCode API Javascript Wrapper

This javascript wrapper for the BreatheCode API is still under heavy development, if you use it, pelase collaborate by fixing any bugs/issues that you find and making the pull requests.

## Instalation

1. Clone the repository inside your project structure:
```
$ git clone https://github.com/breatheco-de/api-javascript-wrapper.git
```

## Usage

1. Import the library on any file where you need to use it
```js
import BC from '../path/to/the/index.js';

// set the 2 paths for the API
BC.setOptions({
  assetsPath: 'http://assets.breatheco.de/apis',
  apiPath: 'http://api.breatheco.de',
  token: 'ASDASDASDASDASASD', //optional
});

// You can also set the token on a separate function, 
// it will be saved in the localStorage if the localStorage is available.
BC.setToken('ASDASDASDASDASASD');
```

## Doing a request
It's always going to be like this:

> BC.**entity**().**action**(data=null).then(function).catch(function);

The entities can be: syllabus, todo, project, user, student, cohort, location, profile. (more entities will be added soon).
The actions in general can be: all, add, delete, update.

Some entities like credentials don't behave the same way and can have special actions like "autenticate" and "remind".

## Example Requests
```js
// login
BC.credentials().autenticate(username, password) 
  .then((data) => console.log(data.access_token))
  .catch((error) => console.error(error)); 
  
// login
BC.credentials().remind(username) 
  .then((data) => console.log(data))
  .catch((error) => console.error(error)); 
  
//get all students
BC.student().all() 
  .then((result) => console.log(result.data))
  .catch((error) => console.error(error)); 
  
//get a single student with id 2
BC.student().get(2) 
  .then((result) => console.log(result.data))
  .catch((error) => console.error(error)); 
  
// delete a task with id 2
BC.task().delete(2) 
  .then((result) => console.log(result.data))
  .catch((error) => console.error(error)); 
  
// update a user with id 2 (it can be a student, teacher, etc.)
BC.user().update({
    full_name: 'Mario Jones'
  }) 
  .then((result) => console.log(result.data))
  .catch((error) => console.error(error)); 

//Other examples!

const getAllCohorts = BC.cohort().all();
getAllCohorts.then((results)=>{
    console.log(results);    
});

const getAllEvents = BC.event().all();
getAllEvents.then((events)=>{
    console.log(events);    
});

const getSingleEvent = BC.event().get(6);
getSingleEvent.then((event)=>{
    console.log(event);    
});

const deleteEvent = BC.event().delete(6);
deleteEvent.then((result)=>{
    console.log(result);    
});

const createEvent = BC.event().add({"description":"<p>4Geeks Nights - Learn to Code for Free Coding is no longer a dream. We are closing the gap and bringing coding to your life. A master platform, full oasd exercises and content, for free. To begin, we will give you free access to our Coding Introduction Program, where you will find everything you need to start your training as a software developer. HTML, CSS, Bootstrap, JavaScript and more. This is not only reading, videos, and tutorials, but tons of exercises and projects to work with.We have five -probably more- GREAT reasons why you should be in our 4Geeks Nights event on June 28th.- You will get FREE access to the Coding Intro Program and platform. Learn to Code has never been easy and better;- You will get free mentorship hours every week;- Our Career Support program speaks for itself. You will meet our Alumni; one of them will talk about his projects and experience at 4Geeks!- You will have fun while meeting our entire team &amp; office: Founders, instructors, partners and classroom spaces. Have a drink with us!- You will get the details about our Software Program.<\/p>","title":"4Geeks Nights: INFO+CODING+GAMES+DRINKS","url":"https:\/\/www.eventbrite.com\/e\/4geeks-nights-infocodinggamesdrinks-tickets-46847266435","capacity":"100","logo_url":"https:\/\/pbs.twimg.com\/profile_images\/930433054371434496\/v8GNrusZ_400x400.jpg","event_date":"2018-06-28 18:00:00","type":"intro_to_coding","address":"66 West Flagler Street #900, Miami, FL 33130","location_slug":"mdc-i","lang":"en","city_slug":"mia","banner_url":"http:\/\/placehold.it\/800x400","invite_only":"true","created_at":"2018-06-28 00:13:06","id":"6","status":"draft"});
createEvent.then((result)=>{
    console.log(result);    
});

```
