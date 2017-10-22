const express = require("express");
const hbs = require("hbs");
const fs = require("fs");
const os = require("os");
const port = process.env.PORT || 3000; // calls port dynamically from the environment variables, sets 3000 if it isn't there.

var app = express();

// tell express to use handle bars as its templating engine
app.set("view engine", "hbs");

//views is the default folder express uses for template files

// app.use is how you invoke middleware
// if you don't call next, it just spins
// request object contains snything you get from the client (browser, OS)


app.use((request, response, next) => {
  var now = new Date().toString();
  var log = `${now}: ${request.method} - ${request.url}`;

// appendFile takes: 3 arguments:
// 1. THe file
// 2. What to add to the end of it
// 3. An error trap callback function
// NOTE: to get line breaks, require os and use os.EOL

  fs.appendFile("server.log", log + os.EOL, (err) => {
    if (err) {
    console.log("Unable to append to the server log.");
    }
  });

  console.log(log);

  next();

});

// if you don't use next, you stop everything after. Useful for a maintence page
// called in the order they are executed. This needs to exist before setting a public directory.
app.use((request, response, next) => {
  response.render("maintenance.hbs");
});


//This one works like middleware for static html
app.use(express.static(__dirname + "/public"));

//


// this tells handlebars where to find partials like an html footer, etc.
hbs.registerPartials(__dirname + "/views/partials");

// handle bar helpers are way for you to register functions to run as template calls

hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
  });

// they can also take arguments

hbs.registerHelper("screamIt", (text) => {
  return text.toUpperCase();
});



// __dirname stores the path to your project directory
// Everything below it becomes available without a discreet call to get

// app.get("/", (request, response) => {

  // response.send(<h1>"Hello express"<h1>); // knows that it's html and sets that as the content type

  // response.send({  // knows that its JSON and sets that as the content type
  //   name: "John Wenger",
  //   age: "42",
  //   projects: ["Calon Lan", "Matrix", "Novel", "Videos", "Teachers Business"]
  // });

app.get("/", (request, response) => {
  response.render("home.hbs", {
    welcomeMessage: "Greetings Earthlings, we come in peace.",
    pageTitle: "Home"
  });
});

app.get("/about", (request, response) => {
  response.render("about.hbs", {
    pageTitle: "About Us"
  });
});

app.get("/bad", (request, response) => {
  response.send({
    code: 404,
    title: "Bad Address",
    message: "There is no page at that address. Please check your url."
  });
});

// binds the app to that port, a common local dev port
// arg 2 is a callback once the launch is compelte
app.listen(port, () => {
  console.log(`Server is ready on port ${port}.`);
});
