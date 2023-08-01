import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('http://your-backend-url/api/users'); // Replace with your backend API endpoint for fetching users
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching users from the backend:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
