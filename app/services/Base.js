const rootPrefix = "../../../";

const mongoose = require('mongoose');

class Base{
  constructor() {
  
  }
  
  perform(){
    const oThis = this;
    
    return oThis._asyncPerform().catch(async function(err) {
      console.error("There is an error in the service");
      console.error(err);
      if(!err){
        return {
          error: 'INTERNAL_SERVER_ERROR',
          code: 500
        }
      }
      return err;
      
    })
  }
  
  async _asyncPerform() {
    throw new Error('Sub-class to implement.');
  }
}

module.exports = Base;