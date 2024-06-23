const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// In-memory storage for questionnaires and questions
let questionnaires = [];

// Route to get all questionnaires
router.get('/questionnaires', (req, res) => {
    res.json(questionnaires);
});

// Route to create a new questionnaire
router.post('/questionnaires', (req, res) => {
    const { name, questions } = req.body;
    const newQuestionnaire = {
        id: questionnaires.length + 1,
        name,
        questions,
        answers: []
    };
    questionnaires.push(newQuestionnaire);
    res.json(newQuestionnaire);
});

// Route to upload documents
router.post('/upload', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ filePath: req.file.path });
});

// Route to generate answers using Langraph (mock implementation)
router.post('/generate-answers', async (req, res) => {
    const { questionnaireId, documentPath } = req.body;
    const questionnaire = questionnaires.find(q => q.id === questionnaireId);

    if (!questionnaire) {
        return res.status(404).json({ error: 'Questionnaire not found' });
    }

    // Mocking Langraph interaction
    questionnaire.answers = questionnaire.questions.map(question => ({
        question,
        answer: 'LG' // Placeholder for Langraph response
    }));

    res.json(questionnaire);
});

// Route to export data
router.get('/export/:id', (req, res) => {
    const questionnaireId = parseInt(req.params.id, 10);
    const questionnaire = questionnaires.find(q => q.id === questionnaireId);

    if (!questionnaire) {
        return res.status(404).json({ error: 'Questionnaire not found' });
    }

    const filePath = path.join(__dirname, `../uploads/questionnaire-${questionnaireId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(questionnaire, null, 2));

    res.download(filePath, err => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to download file' });
        }
    });
});

module.exports = router;
