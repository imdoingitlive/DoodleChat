var models  = require('../models');

module.exports = function() {
	models.Story.create({
    caption1: 'A man is walking',
    caption2: 'in the city',
    caption3: 'with a dog',
    caption4: 'in the rain.',
  }).then(function() {
  	return models.Story.create({
	    caption1: 'A boy is swimming',
	    caption2: 'in a river',
	    caption3: 'next to a boat',
	    caption4: 'with his dog.',
	  })
  }).then(function() {
  	return models.Story.create({
	    caption1: 'An elderly lady',
	    caption2: 'sitting on a bench',
	    caption3: 'by a pond',
	    caption4: 'feeding the ducks.',
	  })
  })
}