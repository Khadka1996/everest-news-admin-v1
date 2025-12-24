import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import API_URL from '../../config';

const BackUp = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch all articles
    axios.get(`${API_URL}/api/articles/all`)
      .then(response => setArticles(response.data.data))
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  const handleDownloadBackup = () => {
    try {
      // Convert articles array to JSON string
      const json = JSON.stringify(articles, null, 2);

      // Create a Blob containing the JSON data
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });

      // Save the Blob as a file
      saveAs(blob, 'articles_backup.json');
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  };

  return (
    <div>
      <h1>Backup Page</h1>

      <button onClick={handleDownloadBackup}>
        Download Backup
      </button>
    </div>
  );
};

export default BackUp;