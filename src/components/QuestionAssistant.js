import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionAssistant = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios.get('/api/question-assistant/questionnaires')
      .then(response => setQuestionnaires(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion('');
  };

  const handleCreateQuestionnaire = () => {
    axios.post('/api/question-assistant/questionnaires', { name, questions })
      .then(response => {
        setQuestionnaires([...questionnaires, response.data]);
        setName('');
        setQuestions([]);
      })
      .catch(error => console.error(error));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('document', selectedFile);
    axios.post('/api/question-assistant/upload', formData)
      .then(response => {
        const { filePath } = response.data;
        const questionnaireId = questionnaires[questionnaires.length - 1].id;
        axios.post('/api/question-assistant/generate-answers', { questionnaireId, documentPath: filePath })
          .then(response => {
            console.log('Answers generated:', response.data);
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Question Assistant</h2>
      <div>
        <input type="text" placeholder="Questionnaire Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="New Question" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} />
        <button onClick={handleAddQuestion}>Add Question</button>
        <button onClick={handleCreateQuestionnaire}>Create Questionnaire</button>
      </div>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload and Generate Answers</button>
      </div>
      <div>
        <h3>Existing Questionnaires</h3>
        <ul>
          {questionnaires.map(q => (
            <li key={q.id}>{q.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionAssistant;
