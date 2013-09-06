--DROP DATABASE Plan4GreenDB
--GO

CREATE DATABASE Plan4GreenDB
GO

USE Plan4GreenDB
GO

CREATE TABLE Organisation
(
	Organisation_Name varchar(600) NOT NULL PRIMARY KEY
);
GO

CREATE TABLE OrganisationalUser
(
	User_ID int IDENTITY NOT NULL,
	
	UserName varchar(255) UNIQUE,
	UserPassword varchar(255),
	
	Organisation_Name varchar(600)
	
	PRIMARY KEY(User_ID)
	FOREIGN KEY REFERENCES Organisation(Organisation_Name)

);
GO

CREATE TABLE Perspective
(
	Perspective_Name varchar(300) NOT NULL,
	
	Description text,
	
	Organisation_Name varchar(600)

	PRIMARY KEY(Perspective_Name, Organisation_Name)
	FOREIGN KEY REFERENCES Organisation(Organisation_Name)
	);
GO

CREATE TABLE Goal
(
	Goal_ID int IDENTITY NOT NULL,
	
	Name text,
	Description text,
	Start_Date date,
	End_Date date,
	Target_Value varchar(100),
	
	Perspective_Name varchar(300),
	Organisation_Name varchar(600),

	PRIMARY KEY(Goal_ID),
	FOREIGN KEY (Perspective_Name, Organisation_Name) REFERENCES Perspective(Perspective_Name, Organisation_Name)
);
GO

CREATE TABLE Measure
(
	Measure_ID int IDENTITY NOT NULL,
	
	Name text,
	Description text,
	Start_Date date,
	End_Date date,
	Target_Value varchar(100),
	
	Goal_ID int

	PRIMARY KEY(Measure_ID)
	FOREIGN KEY REFERENCES Goal(Goal_ID)
);
GO

CREATE TABLE Completion_Score
(
	Completion_Score_Time datetime NOT NULL,
		
	Current_Value float,

	Measure_ID int

	PRIMARY KEY(Completion_Score_Time)
	FOREIGN KEY REFERENCES Measure(Measure_ID)
);
GO