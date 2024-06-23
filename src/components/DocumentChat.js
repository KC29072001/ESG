import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentChat = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    axios.get('/api/document-chat/documents')
      .then(response => setDocuments(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('document', selectedFile);
    axios.post('/api/document-chat/upload', formData)
      .then(response => {
        setDocuments([...documents, response.data]);
        setSelectedFile(null);
      })
      .catch(error => console.error(error));
  };

  const handleSelectDocument = (docId) => {
    setSelectedDocId(docId);
    axios.get(`/api/document-chat/chat/${docId}`)
      .then(response => setChatHistory(response.data))
      .catch(error => console.error(error));
  };

  const handleAskQuestion = () => {
    axios.post('/api/document-chat/chat', { docId: selectedDocId, question })
      .then(response => {
        setChatHistory([...chatHistory, response.data]);
        setQuestion('');
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Document Chat</h2>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Document</button>
      </div>
      <div>
        <h3>Uploaded Documents</h3>
        <ul>
          {documents.map(doc => (
            <li key={doc.id} onClick={() => handleSelectDocument(doc.id)}>
              {doc.fileName}
            </li>
          ))}
        </ul>
      </div>
      {selectedDocId && (
        <div>
          <h3>Chat for Document ID: {selectedDocId}</h3>
          <ul>
            {chatHistory.map((entry, index) => (
              <li key={index}>
                <strong>Q:</strong> {entry.question}<br />
                <strong>A:</strong> {entry.answer}
              </li>
            ))}
          </ul>
          <input type="text" placeholder="Your Question" value={question} onChange={e => setQuestion(e.target.value)} />
          <button onClick={handleAskQuestion}>Ask Question</button>
        </div>
      )}
    </div>
  );
};

export default DocumentChat;
