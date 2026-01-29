/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import ScoWrapper from './components/ScoWrapper';


const App = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const response = await fetch('/api/scorm/launch');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>SCORM Player</h1>
      {!data && (
        // eslint-disable-next-line react/button-has-type
        <button onClick={handleClick} disabled={loading}>
          {loading ? 'Loading...' : 'Launch Course'}
        </button>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>courseId:</strong> {data.courseId}, <strong>scoId:</strong> {data.scoId}, <strong>scoUrl:</strong> {data.scoUrl}</p>
          <ScoWrapper courseId={data.courseId} scoId={data.scoId} scoUrl={data.scoUrl} />
        </div>
      )}
    </div>
  );
};

export default App;
