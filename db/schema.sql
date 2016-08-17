/*
CREATE TABLE `Users` (
  `UserID` INTEGER AUTO_INCREMENT NOT NULL,
  `FirstName` VARCHAR(30),
  `LastName` VARCHAR(30),
  `Email` VARCHAR(30),
  `UserName` VARCHAR(30) NOT NULL,
  `Password` VARCHAR(30),
  KEY `Key` (`UserID`)
);

CREATE TABLE `StoryParts` (
  `StoryID` INTEGER NOT NULL,
  `SequenceID` INTEGER AUTO_INCREMENT NOT NULL,
  `Text` VARCHAR(30)
);

CREATE TABLE `StoryboardSessions` (
  `SessionID` INTEGER AUTO_INCREMENT,
  `StoryID` INTEGER NOT NULL,
  KEY `Key` (`SessionID`)
);

CREATE TABLE `Stories` (
  `StoryID` INTEGER AUTO_INCREMENT NOT NULL,
  KEY `Key` (`StoryID`)
);

CREATE TABLE `User-Images` (
  `SessionID` INTEGER,
  `UserID` INTEGER,
  `StoryID` Type,
  `SequenceID` INTEGER,
  `ImageLink` VARCHAR(255),
  KEY `Key` (`SessionID`, `UserID`, `StoryID`)
);
*/
CREATE DATABASE storyboard_db;

USE storyboard_db;
