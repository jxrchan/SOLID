--  Use these codes to create tables 

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   email varchar(30) NOT NULL,
   password text NOT NULL,
   role varchar(7) NOT NULL,
   name varchar(40),
   gender varchar (20) ,
   description varchar(200),
   profile_picture text,
   sports varchar(200),
   goals varchar(200),
   contact_number char(10),
   facebook text,
   instagram text
);


CREATE TABLE users_users (
    athlete_id UUID,
    coach_id UUID,
    review text,
    PRIMARY KEY (athlete_id, coach_id),
    FOREIGN KEY (athlete_id) REFERENCES users (id),
    FOREIGN KEY (coach_id) REFERENCES users (id)
);

CREATE TABLE activitytypes (
    type varchar(30) PRIMARY KEY 
);

INSERT INTO activitytypes VALUES
('RUNNING'), ('CYCLING'), ('SWIMMING'), ('HIKING'), ('MOUNTAIN BIKING'), 
('WALKING'), ('RUNNING (TREADMILL)'), ('CYCLING (INDOOR)'), 
('ELLIPTICAL TRAINER'), ('ROWING'), ('SKIING'), ('SNOWBOARDING'), 
('CROSSFIT'), ('YOGA'), ('SURFING'), ('KITESURFING'), ('WINDSURFING'), 
('ROCK CLIMBING'), ('HORSEBACK RIDING'), ('PADDLEBOARDING'), 
('OTHER');

CREATE TABLE activities (
    id serial PRIMARY KEY,
    athlete_id UUID  ,
    coach_id UUID ,
    name varchar(40) NOT NULL,
    type varchar(30) NOT NULL REFERENCES sportstype(type),
    date date NOT NULL,
    duration varchar(20),
    coach_comment text,
    athlete_comment text, 
    activity_link varchar(50),
    FOREIGN KEY (athlete_id, coach_id) REFERENCES users_users (athlete_id, coach_id)
);


--  Execute following commands to seed data for users

INSERT INTO users (email, password, role, name, gender, description, profile_picture, sports, goals, contact_number, facebook, instagram) VALUES
('alice@example.com', 'password123', 'COACH', 'Alice Smith', 'Female', 'Experienced track and field coach', 'alice.jpg', 'Track and Field', 'Help athletes achieve their best', '1234567890', 'alice.fb', 'alice.insta'),
('bob@example.com', 'password123', 'ATHLETE', 'Bob Brown', 'Male', 'Aspiring marathon runner', 'bob.jpg', 'Marathon, Running', 'Complete a marathon under 3 hours', '0987654321', 'bob.fb', 'bob.insta'),
('carol@example.com', 'password123', 'COACH', 'Carol White', 'Female', 'Professional swimming coach', 'carol.jpg', 'Swimming', 'Train athletes to compete at national level', '1122334455', 'carol.fb', 'carol.insta'),
('dave@example.com', 'password123', 'ATHLETE', 'Dave Green', 'Male', 'Amateur cyclist', 'dave.jpg', 'Cycling, Mountain Biking', 'Win a local cycling competition', '6677889900', 'dave.fb', 'dave.insta'),
('eve@example.com', 'password123', 'COACH', 'Eve Black', 'Female', 'Strength and conditioning coach', 'eve.jpg', 'Weightlifting, Strength Training', 'Improve overall athlete performance', '4455667788', 'eve.fb', 'eve.insta'),
('frank@example.com', 'password123', 'ATHLETE', 'Frank Red', 'Male', 'Soccer enthusiast', 'frank.jpg', 'Soccer', 'Join a semi-pro soccer team', '5566778899', 'frank.fb', 'frank.insta');



