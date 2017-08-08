# Objects

Below are the major objects of the application:

## Base Objects

All objects will have the following fields:

* id
* created
* updated

## User

Each user is typically a parent, some who can do setup of a family, and track
good and bad behaviors.

Field           | Type          | Description
---             | ---           | ---
name            | varchar(250)  | User name 
email           | varchar(250)  | Email address
emailConfirm    | varchar(6)    | Random unique hash for verifying account 
hash            | varchar(32)   | hash of user Pin
familyId        | int           | ID of connected family
status          | int           | Status of user, 0: unverified, 5: active account
loginAttempts   | int           | Number of (unsuccessful) login attempts since last successful login

## Family

All active users belong to a family

Field           | Type          | Description
---             | ---           | ---
name            | varchar(100)  | Name of family 
timezone        | varchar(100)  | Timezone identifier (https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)


## Kid

Each kid is tied to a family. We don't want to capture too much information about each child
because of the loose login requirements. 

Field           | Type          | Description
---             | ---           | ---
name            | varchar(100)  | Kid name 
familyId        | int           | ID of connected family
birthday        | timestamp     | Birthday of kid, optional 
age             | int           | Either an age or a birthday can be entered 
icon            | varchar(10)   | Unique ID of a selected icon for each kid

## Action
 
Actions are defined by families. They can be positive or negative, and have default values (either reward or cost).
For v1, they'll be global, but eventually customizable by families

Field           | Type          | Description
---             | ---           | ---
familyId        | int           | ID of connected family
name            | varchar(250)  | Action name 
description     | varchar(2000) | Description of action
value           | int           | Default 0, either positive (reward) or negative (cost) 
icon            | varchar(10)   | Unique ID of a selected icon for each kid

## ActionLog
 
Actions are defined by families. They can be positive or negative, and have default values (either reward or cost).
For v1, they'll be global, but eventually customizable by families

Field           | Type          | Description
---             | ---           | ---
familyId        | int           | ID of connected family
name            | varchar(250)  | Action name 
description     | varchar(2000) | Description of action
value           | int           | Default 0, either positive (reward) or negative (cost) 
icon            | varchar(10)   | Unique ID of a selected icon for each kid






