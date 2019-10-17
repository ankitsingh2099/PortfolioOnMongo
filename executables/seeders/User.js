const mongoose = require('mongoose');

const rootPrefix = "../..",
  mongooseConnectionProvider = require(rootPrefix + '/lib/providers/mongodb');


class SeedUsers{
  constructor() {
  
  }
  
  /**
   * Perform.
   *
   * @returns {Promise<void>}
   */
  async perform() {
    return new Promise(async function(onResolve, onReject){
      mongooseConnectionProvider.getConnection().then(function(){
        require(rootPrefix + '/app/models/users');
        const UserModel = mongoose.model('Users'),
          users = [{user_id: 1, portfolio: []}];
    
        UserModel.collection.insert(users, function(err, docs){
          if(err){
            return console.error(err);
            onReject(err);
          } else {
            console.log('Users table seeded successfully');
            onResolve();
          }
        })
      });
    })
  }
}

new SeedUsers().perform().then(function(){
  process.exit(0);
}).catch(function(err){
  console.error('Error occurred: ', err);
  process.exit(1);
});