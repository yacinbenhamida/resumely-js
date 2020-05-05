import axios from "axios";

const headers = {
  "Content-Type": "application/json"
};

const burl = "http://localhost:5000";

export default {
  Predict: function(firstName, lastName) {
    return axios.post(
        `${burl}/predict/`,
      {
        firstName,
        lastName
      },
      {
        headers: headers
      }
    );
  },

  Correct: function(firstName, lastName, label) {
    console.log('Correct called!');
    console.log(firstName, lastName, label);
    return axios.post(
        `${burl}/correct/`,
      {
        firstName,
        lastName,
        label
      },
      {
        headers: headers
      }
    );
  },
};