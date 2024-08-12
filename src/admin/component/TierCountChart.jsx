import React, { useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "../../utils/axios.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.defaults.font.family = "'DungGeunMo'";

const TierCountChart = (props) => {
  const { menu, month, year } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/admin/tiercount/${year}/${month}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [menu, month, year]);

  const labels = useMemo(() => Array.from(new Set(data.map(item => item.tuDate.split('T')[0]))), [data]);

  const goldData = useMemo(() =>
    labels.map(date => {
      const entry = data.find(d => d.tuDate.startsWith(date) && d.tier === 'GOLD');
      return entry ? entry.count : 0;
    }), [labels, data]);

  const silverData = useMemo(() =>
    labels.map(date => {
      const entry = data.find(d => d.tuDate.startsWith(date) && d.tier === 'SILVER');
      return entry ? entry.count : 0;
    }), [labels, data]);

  const bronzeData = useMemo(() =>
    labels.map(date => {
      const entry = data.find(d => d.tuDate.startsWith(date) && d.tier === 'BRONZE');
      return entry ? entry.count : 0;
    }), [labels, data]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Bronze',
        data: bronzeData,
        backgroundColor: 'rgba(215,108,108,0.6)',
      },

      {
        label: 'Silver',
        data: silverData,
        backgroundColor: 'rgba(192, 192, 192, 0.6)',
      },
      {
        label: 'Gold',
        data: goldData,
        backgroundColor: 'rgba(255, 215, 0, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className=' flex justify-center' style={{ width: '450px', height: '450px' }}>
      <Bar data={chartData} options={options} height={400} />
    </div>
  );
};

export default TierCountChart;
