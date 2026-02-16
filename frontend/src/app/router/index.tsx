import { withMocking } from '@/shared/lib/withMocking';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/')({
  component: withMocking(Page)
});

function Page() {
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('https://api.example.com/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => console.error('Lỗi gọi API:', err));
  }, []);
  if (loading) return <div>Loading MSW Data...</div>;
  return (
    <div style={{ padding: '20px' }}>
      <h1>Users (Mock Data)</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
