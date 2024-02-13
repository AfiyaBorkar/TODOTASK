import { useState, useEffect } from "react";
import { supabase } from "../client";
import { BarChart } from "@mui/x-charts/BarChart";
import { format } from "date-fns";

export default function TodoChart() {
  const [todosCount, setTodosCount] = useState(0);

  useEffect(() => {
    fetchTodosCount();
  }, []);

  async function fetchTodosCount() {
    try {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const { data, error } = await supabase
        .from("todos")
        .select("id, created_at")
        .gte("created_at", format(firstDayOfMonth, "yyyy-MM-dd")) 
        .lte("created_at", format(lastDayOfMonth, "yyyy-MM-dd")); 

      if (error) {
        console.error("Error fetching todos:", error.message);
        return;
      }

      setTodosCount(data.length); // Set the count of todos created this month
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  }

  return (
    <div>
      <h4>Total Todos Created This Month: {todosCount}</h4>
      <BarChart
        xAxis={[{ scaleType: "band", data: ["This Month"] }]}
        series={[{ data: [todosCount] }]}
        width={300}
        height={200}
      />
    </div>
  );
}
