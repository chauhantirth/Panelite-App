import axios from 'axios';
import { useState, useEffect } from 'react';

export const validity = async (endpoint, token) => {

    try {
        const data = await axios.get(endpoint);
        // console.log("From api.js, data is: "+data);
        return data.data;
      } catch (error) {
        console.log(error);
      }
};

export const login = async (endpoint, username, password) => {

    try {
        // const data2 = await axios.post(endpoint, data = {
        //     'username': username,
        //     'password': password,
        // });

        const data = await axios.get(endpoint);
        console.log("From api.js, data is: "+data.data);
        return data.data;
      } catch (error) {
        console.log(error);
      }
};

export const logout = async (endpoint, token) => {

  try {
      const data = await axios.get(endpoint);
      console.log("From api.js, data is: "+data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
};