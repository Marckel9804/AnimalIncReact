import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from "../../utils/axios.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.defaults.font.family = "'DungGeunMo'";

const UserCountChart = (props) => {
  const {menu, month, year}= props;
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`/api/admin/redis/usercount/${year}/${month}`)
      .then((res) => {
        setData(res.data)
      })
  }, [menu, month, year]);

  const labels = data.map(item => new Date(item.date).getDate());
  const counts = data.map(item => item.userCount);

  const cMin = Math.min(...counts) - 100;
  const yMin = (cMin<0?0:cMin)
  const yMax = Math.max(...counts) + 100;

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'User Count',
        data: counts,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // This is important to allow the chart to use the parent's height
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Count by Date',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
        min: yMin,
        max: yMax,
      },
    },
  };

  return (
    <div style={{width:'450px', height: '450px' }}> {/* Ensure height is defined */}
      <Line data={chartData} options={options} />
    </div>
  );
}

export default UserCountChart;
