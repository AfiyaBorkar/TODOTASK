import React, { useEffect, useState } from 'react';
import { supabase } from '../client';
import { PieChart } from '@mui/x-charts/PieChart';

const UserAdminTodoRatio = () => {
  const [userData, setUserData] = useState([]);
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [todoCount, setTodoCount] = useState(0);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_admin');

      if (error) {
        console.error('Error fetching user data:', error.message);
        return;
      }

      setUserData(data || []);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  useEffect(() => {
    // Calculate counts
    const admins = userData.filter(user => user.is_admin);
    const todos = userData.filter(user => !user.is_admin);

    setAdminCount(admins.length);
    setUserCount(userData.length - admins.length);
    setTodoCount(todos.length);
  }, [userData]);

  return (
    <div>
      <h4>User, Admin, and Todo Ratio</h4>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: userCount, label: 'Users' },
              { id: 1, value: adminCount, label: 'Admins' },
              { id: 2, value: todoCount, label: 'Todos' },
            ],
          },
        ]}
        width={200}
        height={200}
      />
    </div>
  );
};

export default UserAdminTodoRatio;
