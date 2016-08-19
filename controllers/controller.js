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
    ]

    var pages = [];

    // Create the pages and store them in an array.
    // Once we are done creating all the pages,
    // Create the Story and add the Pages to the Story

    for (var i=0; i<captions.length; i++) {
      models.Caption.create({
          text: captions[i].text
      }).then(function(caption) {
        models.Page.create({
          // Only has imageUrl as an attribute
          // We don't have an image yet so nothing to do here
        }).then(function(page) {
          page.setCaption(caption);
          pages.push(page);
        });          
      });
    }

    // We now have an array of pages that can be
    // can be added to the story.  Create the Story
    // and add the pages.
    return models.Story.create({
      name: 'Test Story 01'   
    }).then(function(story){
         return story.addPages(pages);  
    });
  }

}
