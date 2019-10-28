// import React from 'react';
import axios from 'axios';

// API provider config
const SERVER = 'http://localhost';
const PORT = '3001'
const API_URL = `${SERVER}:${PORT}/apiv1`;
const urlTags = `${API_URL}/tags`;
const urlAdverts = `${API_URL}/anuncios?`;

// TAGS by default
// const TAGS = ['mobile', 'work', 'motor', 'lifestyle'];

const api = {

  getTags: async () => {
    try {
      return await axios.get(urlTags)
        .then( resp => {
          return resp.data.results;
        })
    } catch (error) {
      console.error("Error getting tags", error);
      return ["NO tags"];
    }
  }, // end getTags

  getItems: async (filter, skip, limit) => {
    let filterToSend =  filter;
   
    // ${skip?`&skip=${skip}`:''}${limit?`&limit=${limit}`:''}
    try {
      const resp = await axios.get(`${urlAdverts}${filterToSend}`);
      console.log("getItems filterToSend", `${urlAdverts}${filterToSend}`);
      console.log("getIntems api RESP.DATA", resp.data);
      return resp.data;
    } catch (error) {
      console.error("Error getting Adverts", error);
      return [];
    }
  }, // end getItems

}


export default api;