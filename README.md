# Northcoders News API


A [RESTful API](https://news-api-project-jycn.onrender.com/) to access news application data catergorised articles, comments, topics and users.


# Available API resources


Numerous endpoints are available covering most CRUD operations. For a list of the available resources and their endpoints, see [available endpoints](https://news-api-project-jycn.onrender.com/api).


# Setup


To run locally, you will need to manually create the local database connections by creating the following files in the directory root:

* .env.test

    insert the following:

    ```PGDATABASE=nc_news_test```
   

* .env.development

    insert the following:
    
   ```PGDATABASE=nc_news_test```

The following dependencies will need to be installed:

Dev dependencies:

* "husky": "^8.0.2",
* "jest": "^27.5.1",
* "jest-extended": "^2.0.0",
* "pg-format": "^1.0.4"

Dependencies:

* "dotenv": "^16.0.0",
* "express": "^4.18.2",
* "pg": "^8.7.3",
* "supertest": "^6.3.3"

