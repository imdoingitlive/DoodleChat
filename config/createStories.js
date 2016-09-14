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
  }).then(function() {
  	return models.Story.create({
	    caption1: 'An astronaut',
	    caption2: 'jumping on the moon',
	    caption3: 'holding a flag',
	    caption4: 'of red, white, and blue.',
	  })
  }).then(function() {
  	return models.Story.create({
	    caption1: 'A guitar',
	    caption2: 'sitting next to a tree',
	    caption3: 'in the middle of winter',
	    caption4: 'with snow on the ground.',
	  })
  }).then(function() {
  	return models.Story.create({
	    caption1: 'An artist',
	    caption2: 'painting a picture',
	    caption3: 'of a couple',
	    caption4: 'on a bridge.',
	  })
  }).then(function() {
  	return models.Story.create({
	    caption1: 'A telephone',
	    caption2: 'ringing off the hook',
	    caption3: 'while the pizza is being made',
	    caption4: 'in an Italian restaurant.',
	  })
  }).then(function() {
  	return models.Story.create({
	    caption1: 'A racecar',
	    caption2: 'making a left turn',
	    caption3: 'by a driver from the UK',
	    caption4: 'on a track in Germany.',
	  })
  }).then(function() {
  	return models.Story.create({
	    caption1: 'A DJ',
	    caption2: 'spinning records',
	    caption3: 'in front of a crowd',
	    caption4: 'of 10,000 people.',
	  })
  }).then(function() {
  	return models.Story.create({
	    caption1: 'A plane',
	    caption2: 'about to take off',
	    caption3: 'in the middle of a rain storm',
	    caption4: 'in a Atlanta.',
	  })
  })
}