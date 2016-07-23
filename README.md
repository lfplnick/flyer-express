Flyer Express
=============
*Code Louisville Release*

About
-----
Flyer Express is an application that will allow staff users to request flyers to be printed. When a flyer is requested, it will be placed into the user's cart until they are ready to check out. Once users complete the check-out process a request will be sent in the form of a ticket to the current ticketing system in use by the library's print shop.

The application will have two sides to it: the staff side and the administrative side. The staff side will showcase various flyers promoting events throughout the library system which staff can add to a cart and then order. After orders are placed a ticket will be sent to the print shop which will in turn fill orders.

The administrative side will allow admins to add new flyers and otherwise manage application setup.

Current State
-------------
Flyer Express is currently in development. This pre-release is meant to showcase a small portion of the admin section for a Code Louisville final project. There are currently two parts of the admin section: a form for adding new flyers and a form for managing a list of locations.

The add flyers section has the current set of functionality:
- Interactive fields which tie into Angular variables
- Location list pulled from Mongo database
- Ability to upload a picture by choosing a file and clicking the `Preview` button (filenames are changed to a hash and uploaded to the public/uploads folder)

The location manager is fully tied into the Mongo database. With it you can:
- Add locations
- Modify existing locations
- Delete locations

Changes are held in a pending state until either the `Submit Changes` button is pressed to record changes to the database or the `Discard Changes` button is pressed to reset the list.

Setup
-----
To get Flyer Express up and running start by cloning this repo. You'll need Node.js and MongoDB installed for it to work correctly. After cloning:
- Run `npm install` in the root folder to install dependencies
- Start src/app.js with your favorite Node runner

Since there isn't a lot of data to be managed at this point there isn't really a database initialization process. Simply add a few locations and they'll show up in the add flyer section. If you want a small set of data to start with simply uncomment the `require(./seed);` line in src/app.js and the database will be initialized with LFPL's current set of branches upon application restart.

Leave Comments!
---------------
Please feel free to add comments and suggestions for the project! If you find any bugs please submit them.

Thank you for taking the time to look over this project!
