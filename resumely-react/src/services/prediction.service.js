import axios from "axios";

const headers = {
  "Content-Type": "application/json"
};

const burl = "http://localhost:5000";

export default {
  Predict: function(firstName, lastName) {
    return axios.post(
      `${burl}/prediction/predict/`,
      {
        firstName,
        lastName
      },
      {
        headers: headers
      }
    );
  },
};