"use strict";

var models  = require('../models');

module.exports = {

  createStories: function() {

    // Test CRUD of Stories, Pages, Captions and their relationships
    // to one another

    // Start with 1 Story with 4 parts
    var captions = [
      {text: "A man is walking"}, 
      {text: "in the city"}, 
      {text: "with a dog"}, 
      {text: "in the rain."}
    ];

    var pages = [];

    // Create the pages and store them in an array.
    // Once we are done creating all the pages,
    // Create the Story and add the Pages to the Story

    return models.Story.create({

      name: 'Test Story 01'

    }).then(function(story){

      for (var i=0; i<captions.length; i++) {

        models.Caption.create({

            text: captions[i].text

        }).then(function(caption) {

          models.Page.create({

            caption: caption

          }).then(function(page) {

            console.log("page.setCaption and pages.push")
            console.log("page: " + page.id);

            page.setCaption(caption);
            page.setStory(story);
            
            pages.push(page);

//            console.log(page);
          });

        });

      } // End of For Loop


      return story.addPages(pages);

    }).error(function(error){
      done(error);
    }); // End of Story :)

  }
}
