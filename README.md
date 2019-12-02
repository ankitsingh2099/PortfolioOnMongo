# Portfolio on Mongo

### Mongo Server
Run the mongo server and set the following environment variables.
MAIN_DB_MONGO_HOST='localhost'
MAIN_DB_MONGO_USER='staging_user'
MAIN_DB_MONGO_PASSWORD='root!2019!smallcase'
MAIN_DB_MONGO_NAME='smallcase'

###Seed collections
Run following script to set some pre requisite data in the collection.
```
node executables/seeders/User.js
node executables/seeders/Stock.js
```

### Run Server
```
node ./bin/www
```

### Test
Connect to the remote server using postman.

Postman collection: test/postman/smallcase.postman_collection.json
Environment: test/postman/remote.postman_environment.json
