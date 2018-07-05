window.BC.setToken({
    bc_token: '',
    assets_tokekn: ''
});
window.BC.assetsPath='https://assets-alesanchezr.c9users.io/apis';
window.BC.apiPath='https://talenttree-alesanchezr.c9users.io';

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