import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'; // Make sure to install Chart.js if you haven't already
import './stat.css'; // Ensure this file uses Tailwind CSS if needed

const Stat = () => {
  const [topProducts, setTopProducts] = useState([]);
  const chartRef = useRef(null);
  

  useEffect(() => {
    const API_URL = 'https://api.jsonbin.io/v3/b/669b40b9e41b4d34e4146b16';
    const API_KEY = '$2a$10$Sq2/s3mmIbMiz7RDJ4Ls/uquZa0h0DSVMa5t5gL3PmhnoTg7U.OZy';

    const fetchData = async () => {
      try {
        let response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'X-Master-Key': API_KEY,
          },
        });

        if (!response.ok) throw new Error('Error fetching data');

        let data = await response.json();
        let products = data.record.Product;

        let topProducts = products
          .slice()
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 3);

        setTopProducts(topProducts);

        const ctx = chartRef.current.getContext('2d');
        const fixedColors = [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 205, 86, 1)',
        ];

        const colors = products.map((_, index) => fixedColors[index % fixedColors.length]);

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: products.map(product => product.name),
            datasets: [{
              label: 'Quantity',
              data: products.map(product => product.quantity),
              backgroundColor: colors,
            }],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
              },
              y: {
                beginAtZero: true,
                ticks: {
                  display: true,
                },
                title: {
                  display: true,
                  text: 'Quantity',
                },
              },
            },
          },
        });
      } catch (error) {
        console.error('Error fetching data: ', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <section className="flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-4 mb-4">
          {topProducts.map((product, index) => (
            <div key={index} className="card bg-white shadow-md p-4 rounded-lg flex-1">
              <h1 className="text-lg font-bold">{product.name}</h1>
              <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
            </div>
          ))}
        </div>
        <section className="bg-white shadow-md rounded-lg p-4">
          <h1 className="text-xl font-semibold mb-4">Inventory Status</h1>
          <canvas ref={chartRef} className="w-full h-80"></canvas>
        </section>
      </section>
    </div>
  );
};

export default Stat;
