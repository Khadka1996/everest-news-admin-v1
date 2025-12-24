// ActivityLog.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

const ActivityLog = () => {
  const [activityLogs, setActivityLogs] = useState([]);

  // Fetch activity logs from your API or data source
  const fetchActivityLogs = () => {
    // Example: Replace this with your actual API call or data retrieval logic
    const fakeActivityLogs = [
      { admin: 'Admin1', activity: 'Logged in', timestamp: new Date().toISOString() },
      { admin: 'Admin2', activity: 'Created a new post', timestamp: new Date().toISOString() },
      // Add more activity log entries as needed
    ];

    setActivityLogs(fakeActivityLogs);
  };

  useEffect(() => {
    // Fetch activity logs when the component mounts
    fetchActivityLogs();
  }, []);

  return (
    <Container className="mt-3">
      <h2>Activity Log</h2>
      <Row>
        <Col>
          <ListGroup>
            {activityLogs.map((log, index) => (
              <ListGroup.Item key={index}>
                <strong>{log.admin}</strong> - {log.activity} ({new Date(log.timestamp).toLocaleString()})
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default ActivityLog;