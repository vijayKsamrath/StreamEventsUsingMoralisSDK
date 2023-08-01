import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      const response = await axios.get('/api/users'); // Assuming your API endpoint is at /api/users
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  return (
    <div>
      <Head>
        <title>All Users</title>
        <meta name="description" content="Displaying all users using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>All Users</h1>
        {users.map((user) => (
          <div key={user.id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Phone Number: {user.phoneNumber}</p>
            <hr />
          </div>
        ))}
      </main>
    </div>
  );
}

