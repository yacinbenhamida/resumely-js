import axios from "axios";

const headers = {
  "Content-Type": "application/json"
};

const burl = process.env.REACT_APP_BACKEND;

export default {
  Login: function(email, password) {
    console.log(`${burl}/login/`);
    console.log(email, password);

    return axios.post(
        `${burl}/login/`,
      {
        email,
        password
      },
      {
        headers: headers
      }
    );
  },

  notifyFacebookLogin: function(data) {
    console.log(`${burl}/oauth/facebook`);

    return axios.post(
        `${burl}/oauth/facebook`,
      {
        data
      },
      {
        headers: headers
      }
    );
  },
};