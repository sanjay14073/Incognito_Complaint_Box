import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const ReportGenerator = () => {
  const [input, setInput] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const componentRef = useRef(null);

  const API_URL = 'http://127.0.0.1:5000/admin/report';

  const handlePrint = useReactToPrint({
    contentRef:componentRef
  });

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_report' }),
      });
      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      setResponseData([{ error: error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitInput = async () => {
    if (!input.trim()) {
      setResponseData([{ error: 'Please enter some input' }]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();
      setResponseData(data.data);
    } catch (error) {
      setResponseData([{ error: error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1>Report Generator</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleGenerateReport} disabled={isLoading} style={styles.buttonGreen}>
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your question or input here..."
          style={styles.textarea}
        />
        <button onClick={handleSubmitInput} disabled={isLoading} style={styles.buttonBlue}>
          {isLoading ? 'Submitting...' : 'Submit Input'}
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={handlePrint} style={styles.buttonGray}>Print Report</button>
      </div>

      {/* Always render table so ref is never null */}
      <div ref={componentRef} style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Summary</th>
              <th>Complaint</th>
              <th>Proof</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {responseData.length > 0 ? responseData.map((item, idx) => (
              <tr key={idx}>
                <td>{item.title}</td>
                <td>{item.issue_category?.join(', ')}</td>
                <td>{item.status}</td>
                <td>{item.priority_factor}</td>
                <td>{item.summarized_complaint}</td>
                <td>{item.complaint}</td>
                <td>
                  <a href={item.complaint_proof} target="_blank" rel="noopener noreferrer">Proof</a>
                </td>
                <td>{item.lastupdate ? new Date(item.lastupdate).toLocaleString() : ''}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No data yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  buttonGreen: {
    padding: '10px 15px',
    marginRight: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonBlue: {
    padding: '10px 15px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonGray: {
    padding: '8px 12px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    minHeight: '100px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
};

export default ReportGenerator;
