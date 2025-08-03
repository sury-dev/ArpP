import axios from '../api/axios';

export const fetchAnalytics = async () => {
  try {
    const response = await axios.get('/api/analytics');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};
