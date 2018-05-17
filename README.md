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
});

// it will be saved in the localStorage if the localStorage is available.
BC.setToken('ASDASDASDASDASASD');
```

## Doing a request
Its always going to be like this:

> BC.**entity**().**action**(data=null).then(function).catch(function);

The entities can be: syllabus, todo, project, user, student, cohort, location, profile.
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
  
// update a student with id 2
BC.location().update({
    full_name: 'Mario Jones'
  }) 
  .then((result) => console.log(result.data))
  .catch((error) => console.error(error)); 

```
