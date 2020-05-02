import axios from 'axios'
export const getNotifications = (limit = 6, userId) => {
  axios.post(process.env.REACT_APP_BACKEND
    +'/check-scrapping?secret_token='+localStorage.getItem('token'),{id : userId})
};
