import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import QuestionAssistant from './components/QuestionAssistant';
import DocumentChat from './components/DocumentChat';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/question-assistant">Question Assistant</Link></li>
            <li><Link to="/document-chat">Document Chat</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/question-assistant" element={<QuestionAssistant />} />
          <Route path="/document-chat" element={<DocumentChat />} />
          <Route path="/" element={<h2>Welcome to the LangChain Server</h2>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
