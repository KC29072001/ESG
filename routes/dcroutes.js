const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// In-memory storage for uploaded documents and chat history
let documents = [];
let chats = {};

// Route to upload a document
router.post('/upload', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const document = {
        id: documents.length + 1,
        filePath: req.file.path,
        fileName: req.file.originalname,
        preview: `Preview of ${req.file.originalname}`, // Placeholder for actual preview generation
    };
    documents.push(document);
    res.json(document);
});

// Route to get all uploaded documents
router.get('/documents', (req, res) => {
    res.json(documents);
});

// Route to get chat history for a document
router.get('/chat/:docId', (req, res) => {
    const docId = parseInt(req.params.docId, 10);
    res.json(chats[docId] || []);
});

// Route to ask a question and get an answer (mocked with "LG" for now)
router.post('/chat', (req, res) => {
    const { docId, question } = req.body;
    const doc = documents.find(d => d.id === docId);

    if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
    }

    const answer = 'LG'; // Placeholder for actual Langraph interaction
    if (!chats[docId]) {
        chats[docId] = [];
    }
    const chatEntry = { question, answer };
    chats[docId].push(chatEntry);

    res.json(chatEntry);
});

module.exports = router;
