import React from "react";
import { launchPlayer } from "../adapters/scorm12/player/PlayerBootstrap";

interface ScoWrapperProps {
  courseId: string,
  scoId: string;
  scoUrl: string;
}

const ScoWrapper: React.FC<ScoWrapperProps> = ({ courseId, scoId, scoUrl }) => {
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const authorizeScorm = async () => {
      try {
        const context = await launchPlayer(`/scorm/api/${courseId}/${scoId}`, () => { console.log(111111)});
        setIsAuthorized(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authorization failed');
        setIsAuthorized(false);
      }
    };
    
    if (courseId && scoId) {
      authorizeScorm();
    }
  }, [courseId, scoId]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!isAuthorized) {
    return <div>Loading SCORM content...</div>;
  }

  return (
    <iframe
      src={scoUrl}
      title="SCORM Content"
      width="100%"
      height="600"
      // Add security attributes as needed
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
};

export default ScoWrapper;
