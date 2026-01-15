import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

let cmiPack: {elements: Record<string, string> } = {
  elements:{
    'cmi.core.entry': 'ab-initio',
    'cmi.core.lesson_status': 'incomplete',
    'cmi.core.lesson_location': '',
    'cmi.core.score.raw': '',
    'cmi.core.student_id': 'user-789',
    'cmi.core.student_name': 'John Doe',
    'cmi.suspend_data': ''
  }
};

const injectReadOnly = (currentCmiPack: { elements: Record<string, string> }, updateCmiPack: { elements: Record<string, string> }) => ({
  elements: {
    ...currentCmiPack.elements,
    ...updateCmiPack.elements
  }
})

app.use(express.json());

// Serve static files from /server/courses
app.use('/courses', express.static(path.join(__dirname, '../courses')));

// API routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.get('/api/scorm/launch', (req, res) => {
  res.json({ courseId: "crs123", scoId: "sco456", scoUrl: '/courses/crs001/lesson01.html'});
});

app.get('/scorm/api/crs123/sco456/data-elements', (req, res) => {
  res.json(cmiPack);
});

app.patch('/scorm/api/crs123/sco456/data-elements', (req, res) => {
  cmiPack = injectReadOnly(cmiPack, req.body);
  res.json(cmiPack);
});

app.post('/scorm/api/crs123/sco456/LMSCommit', (req, res) => {
  cmiPack = injectReadOnly(cmiPack, req.body);
  res.json(cmiPack);
});

app.post('/scorm/api/crs123/sco456/LMSFinish', (req, res) => {
  cmiPack = injectReadOnly(cmiPack, req.body);
  res.json(cmiPack);
});


// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/dist', 'index.html'));
  });
}

// ✅ CORRECT LOCATION: After all routes, before final error handler
// Development error handler (verbose errors)
if (process.env.NODE_ENV === 'development') {
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error stack:', err.stack);
    res.status(500).json({
      message: err.message,
      stack: err.stack
    });
  });
}

// Generic catch-all error handler (optional - for production safety)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});