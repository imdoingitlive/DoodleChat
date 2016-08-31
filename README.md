# Storyboard
Drawing app for the second group project of Rutgers Coding Bootcamp.

## Screenshots
Include a one or two screenshots of main UI/UX points of your app and how it solves a problem

Login/Signup | Sketch
-------------|--------
![Login/Signup Form Image](/readme_images/login_signup.png?raw=true"login_signup.png") | ![Sketch Form Image](/readme_images/select_group.png?raw=true"select_group.png")


Sketch 1 | Sketch 2 | Sketch 3 | Sketch 4
---------|----------|----------|---------
![Sketch 1 Image](/readme_images/sketch.01.png?raw=true"sketch.01.png") | ![Sketch 2 Image](/readme_images/sketch.02.png?raw=true"sketch.02.png") | ![Sketch 3 Image](/readme_images/sketch.03.png?raw=true"sketch.03.png") | ![Sketch 4 Image](/readme_images/sketch.04.png?raw=true"sketch.04.png")

## Technologies used
You can give a brief listing of the technologies you've learned and applied here
- Node.JS
    - Express
    - Handlebars
    - Sequelize
    - Socketio
    - Sketch.JS
    - Cookie Parser
    - Body Parser
    - Favicon
    - Logger
    - Method Override
    - Passport
- MySql
- Lucidchart

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisities

What to install and how for local development and testing purposes

```
- node.js: visit node.js and download...
- mysqldb: brew install mysql
- Storyboard: npm i
```

## Running the tests

Explain how to run the automated tests for this system (if applicable)

```
To Start the Server:

npm run serve
```

## Built With

* Sublime Text
* Node Package Manager
* Heroku

## Deployed With

* Heroku
* JawsDB

## Walk throughs of code
Here is a section of code that selects the 5 recent groups and checks to see if user is any of the groups so a join button can be added if they are not.

```
// Create obj for rendering
var hbsObject = {
    username: req.user.username,
    recentGroups: [],
    userGroups: []
};

// Find most recently created groups
models.Group.findAll({
    limit: 5,
    order: 'id DESC'
})

// Create a loop through function that is called recursively
.then(function loopThrough(recentGroups, counter) {

    // Set counter
    if (counter === undefined) counter = 0;
    if (counter >= recentGroups.length) {
        cb() // Callback function to get out of recursive loop and continue
        return
    }

    // Get groupname and totalusers
    var obj = {
        groupname: recentGroups[counter].dataValues.groupname,
        totalusers: recentGroups[counter].dataValues.totalusers
    }

    // Check if total users is reached
    if (obj.totalusers === 4) {

        obj.joined = true; // Even though not actually joined, it does not display ability to join

        // Push obj to recent groups
        hbsObject.recentGroups.push(obj);

        // Recursion
        counter++;
        loopThrough(recentGroups, counter)

    } 
    
    // If user can be added
    else {

        // Check if user is in group
        recentGroups[counter].getUsers({where : {username: req.user.username}})

        .then(function(results) {

            // If no result, user is not in group
            if (results.length === 0)
                obj.joined = false;
            else
                obj.joined = true;

            // Push obj to recent groups
            hbsObject.recentGroups.push(obj);

            // Recursion
            counter++;
            loopThrough(recentGroups, counter)

        });
    }               

});
```

## Authors

* **Matthew Bajorek** - [Matthew Bajorek](https://github.com/mattbajorek)
* **Edwin Rivera** - [Edwin Rivera](https://github.com/imdoingitlive)
* **Stefanie Centi** - [Stefanie Centi](https://github.com/stefcenti)

See also the list of [contributors](https://github.com/imdoingitlive/Storyboard/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
