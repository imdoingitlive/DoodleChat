# Storyboard
Drawing app for the second group project of Rutgers Coding Bootcamp.

## Screenshots

Login/Signup | Sketch
-------------|--------
![Login/Signup Form Image](/readme_images_2/login.png?raw=true"login.png") | ![Sketch Form Image](/readme_images_2/group.png?raw=true"group.png")


Sketch 1 | Sketch 2 | Sketch 3 | Sketch 4
---------|----------|----------|---------
![Sketch 1 Image](/readme_images_2/part1Edit.png?raw=true"part1Edit.png") | ![Sketch 2 Image](/readme_images_2/part2Edit.png?raw=true"part2Edit.png") | ![Sketch 3 Image](/readme_images_2/part3Edit.png?raw=true"part3Edit.png") | ![Sketch 4 Image](/readme_images_2/part4Edit.png?raw=true"part4Edit.png")

Final 
------
![Final Image](/readme_images_2/finalEdit.png?raw=true"finalEdit.png")

## Technologies used
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

### Prerequisities

- Node.JS - visit nodejs.org and download...
- MySql: brew install mysql (Mac) or visit mysql.com for MSI (Windows)

## Getting Started

When you download the repo, run the following command to get all the dependencies

```
npm i
```
To Start the Server:

```
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
* All those times in elementary school where you tried to play this game on pieces of paper
