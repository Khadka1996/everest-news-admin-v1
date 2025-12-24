import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import API_URL from '../../config';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const convertToNepaliNumber = (number) => {
  const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return number.toString().split('').map(digit => nepaliNumbers[digit]).join('');
};

const Analytics = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [headlineSearch, setHeadlineSearch] = useState('');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  useEffect(() => {
    axios.get(`${API_URL}/api/articles/all`)
      .then(response => setArticles(response.data.data))
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  const handleHeadlineClick = async (articleId) => {
    try {
      const response = await axios.get(`${API_URL}/api/articles/byId/${articleId}`);
      const articleDetails = response.data.data;
      setSelectedArticle(articleDetails);
    } catch (error) {
      console.error('Error fetching detailed article data:', error);
    }
  };

  const handleClosePopup = () => {
    setSelectedArticle(null);
  };

  const sortedArticles = articles.sort((a, b) => {
    switch (sortBy) {
      case 'lastUpdated':
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      case 'topViews':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const filteredArticles = currentArticles.filter(article =>
    !headlineSearch || article.headline.toLowerCase().includes(headlineSearch.toLowerCase())
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedArticles.length / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  // Aggregate data for total views and shares
  const totalViews = articles.reduce((acc, article) => acc + article.views, 0);
  const totalShares = articles.reduce((acc, article) => acc + article.shareCount, 0);

  // Chart data for total views and shares (Bar chart)
  const overallBarChartData = {
    labels: ['Total Views', 'Total Shares'],
    datasets: [
      {
        label: 'Counts',
        data: [totalViews, totalShares],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  // Chart data for Pie chart (overall)
  const overallPieChartData = {
    labels: ['Total Views', 'Total Shares'],
    datasets: [
      {
        data: [totalViews, totalShares],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  // Chart data for selected article views and shares
  const articleChartData = {
    labels: selectedArticle ? ['Views', 'Shares'] : [],
    datasets: [
      {
        label: 'Counts',
        data: selectedArticle ? [selectedArticle.views, selectedArticle.shareCount] : [],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  // Chart data for Pie chart (individual article)
  const articlePieChartData = {
    labels: selectedArticle ? ['Views', 'Shares'] : [],
    datasets: [
      {
        data: selectedArticle ? [selectedArticle.views, selectedArticle.shareCount] : [],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by headline"
          value={headlineSearch}
          onChange={(e) => setHeadlineSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy} className="border border-gray-300 p-2 rounded">
          <option value="lastUpdated">Last Updated</option>
          <option value="topViews">Top Views</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-2">Articles:</h2>
      {filteredArticles.map((article, index) => (
        <div key={article._id} className="mb-2">
          <p>{convertToNepaliNumber(indexOfFirstArticle + index + 1)}. </p>
          <h3
            className="text-lg font-medium cursor-pointer hover:text-blue-500"
            onClick={() => handleHeadlineClick(article._id)}
          >
            {article.headline}
          </h3>
        </div>
      ))}

      <div className="pagination mb-4">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => setCurrentPage(number)} className="border border-gray-300 p-1 rounded mx-1">
            {convertToNepaliNumber(number)}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Overall Analytics (Bar Chart):</h2>
      <Bar data={overallBarChartData} options={{ responsive: true }} className="mb-4" />

      <h2 className="text-xl font-semibold mb-2">Overall Analytics (Pie Chart):</h2>
      <Pie data={overallPieChartData} options={{ responsive: true }} className="mb-4" />

      {selectedArticle && (
        <div className="popup fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="popup-inner analytics-popup bg-white rounded p-4 shadow-lg">
            <h2 className="text-xl font-bold">{selectedArticle.headline}</h2>
            <div className="article-info mb-4">
              <p className="views-info">Views: {convertToNepaliNumber(selectedArticle.views)}</p>
              <p className="share-count-info">Share Count: {convertToNepaliNumber(selectedArticle.shareCount)}</p>
            </div>
            <Bar data={articleChartData} options={{ responsive: true }} className="mb-4" />
            <Pie data={articlePieChartData} options={{ responsive: true }} className="mb-4" />
            <button onClick={handleClosePopup} className="mt-4 bg-blue-500 text-white p-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
