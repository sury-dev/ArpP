import axios from 'axios';

const baseURL = '/api';
const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;
