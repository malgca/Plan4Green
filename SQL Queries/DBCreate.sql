--DROP DATABASE Plan4GreenDB
--GO

CREATE DATABASE Plan4GreenDB
GO

USE Plan4GreenDB
GO

CREATE TABLE Organisation
(
	Organisation_Name varchar(900) NOT NULL PRIMARY KEY
);
GO

CREATE TABLE OrganisationalUser
(
	User_ID int IDENTITY NOT NULL PRIMARY KEY,
	
	UserName varchar(255) UNIQUE,
	UserPassword varchar(255),
	
	Organisation_ID varchar(900) FOREIGN KEY REFERENCES Organisation(Organisation_Name)
);
GO

CREATE TABLE Perspective
(
	Perspective_Name varchar(900) NOT NULL PRIMARY KEY,
	
	Description text,
	
	Organisation_ID varchar(900) FOREIGN KEY REFERENCES Organisation(Organisation_Name)
);
GO

CREATE TABLE Goal
(
	Goal_ID int IDENTITY NOT NULL PRIMARY KEY,
	
	Name text,
	Description text,
	Start_Date date,
	End_Date date,
	Target_Value varchar(100),
	
	Perspective_ID varchar(900) FOREIGN KEY REFERENCES Perspective(Perspective_Name)
);
GO

CREATE TABLE Measure
(
	Measure_ID int IDENTITY NOT NULL PRIMARY KEY,
	
	Name text,
	Description text,
	Start_Date date,
	End_Date date,
	Target_Value varchar(100),

	Goal_ID int FOREIGN KEY REFERENCES Goal(Goal_ID)
);
GO

CREATE TABLE Completion_Score
(
	Completion_Score_Time datetime NOT NULL PRIMARY KEY,
		
	Current_Value float,

	Measure_ID int FOREIGN KEY REFERENCES Measure(Measure_ID)
);
GO