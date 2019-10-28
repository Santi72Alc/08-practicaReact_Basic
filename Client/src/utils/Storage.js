
const MASTER_KEY = "wallakeep_"

// storage Object of Functions to use the localStorage
const Storage = {

  // Check if the Key exist
  isKey: function ( key="" ) {
    try {
      return localStorage.getItem(MASTER_KEY+key) ? true : false;
    } catch (err) {
      console.error("Error getting values from localStorage", err);
      return false;
    }
  },

  // Get de value of the key
  load: function ( key="" ) {
    try {
      if ( this.isKey(key) ) {
        return JSON.parse(localStorage.getItem(MASTER_KEY+key));
      } 
    } catch (error) {
      const msg = "Error saving in localStorage";
      console.error(msg, error);
      return null;
    }
    return {}
  },

  // Save data in the key of localStorage
  save: function ( value, key="" ) {
    try {
      localStorage.setItem(MASTER_KEY+key, JSON.stringify(value));
      return value;
    } catch (error) {
      const msg = "Error saving in localStorage";
      console.error(msg, error);
      return null;
    }
  },

  // Remove the key from localStorage
  remove: function ( key="" ) {
    localStorage.removeItem(MASTER_KEY+key)
  }

}; // end of storage object


export default Storage;