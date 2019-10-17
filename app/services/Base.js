const rootPrefix = "../../../";

const mongoose = require('mongoose');

class Base{
  constructor() {
  
  }
  
  /**
   * Perform
   *
   * @returns {Promise<void | {code: number, success: boolean, error: string}>}
   */
  perform(){
    const oThis = this;
    
    return oThis._asyncPerform().catch(async function(err) {
      console.error("There is an error in the service");
      console.error(err);
        return {
          success: false,
          error: 'INTERNAL_SERVER_ERROR',
          code: 500
        }
    })
  }
  
  /**
   * Async Perform
   *
   * @returns {Promise<void>}
   * @private
   */
  async _asyncPerform() {
    throw new Error('Sub-class to implement.');
  }
}

module.exports = Base;