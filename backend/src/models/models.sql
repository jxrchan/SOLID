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
   profile_picture varchar(50),
   sports varchar(200),
   goals varchar(200),
   contact_number char(10),
   facebook varchar(50),
   instagram varchar(50)
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
    date TIMESTAMP NOT NULL,
    duration varchar(20),
    coach_comment text,
    athlete_comment text, 
    activity_link varchar(50),
    FOREIGN KEY (athlete_id, coach_id) REFERENCES users_users(athlete_id, coach_id)
);


--  Execute following commands to seed data test APIs



