import { useState, useEffect } from 'react';
import { supabase } from '../client';
import { BarChart } from '@mui/x-charts/BarChart';
import { format } from 'date-fns';

export default function UserChart() {
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    fetchUsersCount();
  }, []);

  async function fetchUsersCount() {
    try {
      const currentDate = new Date();
      const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31);

      const { data, error } = await supabase
        .from('users')
        .select('id, created_at')
        .gte('created_at', format(firstDayOfYear, 'yyyy-MM-dd')) 
        .lte('created_at', format(lastDayOfYear, 'yyyy-MM-dd'));

      if (error) {
        console.error('Error fetching users:', error.message);
        return;
      }
// Set the count of users registered this year
      setUsersCount(data.length); 
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  }

  return (
    <div>
      <h4>Total Users Registered This Year: {usersCount}</h4>
      <BarChart
        xAxis={[{ scaleType: 'band', data: ['This Year'] }]}
        series={[{ data: [usersCount] }]}
        width={300}
        height={200}
        colors={['red']}
      />
    </div>
  );
}
