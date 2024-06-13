import React, { useEffect, useState } from 'react';
import './DashBoard.css';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faDollarSign, faUsers, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const DashBoard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ['Orders', 'Amount', 'Users', 'Products'],
    datasets: [
      {
        label: 'Dashboard Data',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("start");
        const response = await fetch('http://localhost:5000/api/v1/task/dashboard', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
            'Content-type': 'application/json',
          },
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
          setTotalOrders(data.totalOrders);
          setTotalAmount(data.totalAmount);
          setTotalUsers(data.totalUsers);
          setTotalProducts(data.totalProducts);

          setChartData((prevChartData) => ({
            ...prevChartData,
            datasets: [
              {
                ...prevChartData.datasets[0],
                data: [data.totalOrders, data.totalAmount, data.totalUsers, data.totalProducts],
              },
            ],
          }));
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-item">
          <FontAwesomeIcon icon={faShoppingCart} size="2x" />
          <h3>Orders</h3>
          <p className="count">{totalOrders}</p>
        </div>
        <div className="stat-item">
          <FontAwesomeIcon icon={faDollarSign} size="2x" />
          <h3>Amount</h3>
          <p className="count">{totalAmount}</p>
        </div>
        <div className="stat-item">
          <FontAwesomeIcon icon={faUsers} size="2x" />
          <h3>Users</h3>
          <p className="count">{totalUsers}</p>
        </div>
        <div className="stat-item">
          <FontAwesomeIcon icon={faBoxOpen} size="2x" />
          <h3>Products</h3>
          <p className="count">{totalProducts}</p>
        </div>
      </div>
      <div className="chart-container">
        <Chart type="bar" data={chartData} />
      </div>
    </div>
  );
};
