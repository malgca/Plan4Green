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
		
	Organisation_Name varchar(600) NOT NULL

	PRIMARY KEY(User_ID)
	FOREIGN KEY REFERENCES Organisation(Organisation_Name)
);
GO

CREATE TABLE Perspective
(
	Perspective_Name varchar(300) NOT NULL,

	Description text,

	X_Position int,
	Y_Position int,

	Organisation_Name varchar(600) NOT NULL

	PRIMARY KEY(Perspective_Name, Organisation_Name)
	FOREIGN KEY REFERENCES Organisation(Organisation_Name)
	);
GO

CREATE TABLE Goal
(	
	Goal_Name varchar(450) NOT NULL,

	Description text,

	Start_Date varchar(100),
	Due_Date varchar(100),

	X_Position int,
	Y_Position int,
	
	Perspective_Name varchar(300),
	Organisation_Name varchar(600),

	PRIMARY KEY(Goal_Name, Perspective_Name),
	FOREIGN KEY (Perspective_Name, Organisation_Name) REFERENCES Perspective(Perspective_Name, Organisation_Name)
);
GO

CREATE TABLE Measure
(
	Measure_Name varchar(450) NOT NULL,

	Description text,

	Start_Date varchar(100),
	Due_Date varchar(100),

	X_Position int,
	Y_Position int,

	Target_Value varchar(100),
	Organisation_Name varchar(600),

	Perspective_Name varchar(300) NOT NULL,
	Goal_Name varchar(450) NOT NULL
	
	PRIMARY KEY(Measure_Name, Goal_Name),
	FOREIGN KEY (Goal_Name, Perspective_Name) REFERENCES Goal(Goal_Name, Perspective_Name)
);
GO

CREATE TABLE Completion_Score
(
	Completion_Score_Time varchar(100) NOT NULL,
		
	Current_Value float,

	Measure_Name varchar(450) NOT NULL,
	Goal_Name varchar(450) NOT NULL

	PRIMARY KEY(Completion_Score_Time),
	FOREIGN KEY (Measure_Name, Goal_Name) REFERENCES Measure(Measure_Name, Goal_Name)
);
GO
