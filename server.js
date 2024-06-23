const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

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

const questionAssistantRoutes = require('./routes/qaroutes');
const docChatRoutes = require('./routes/dcroutes');
// const goodGovScreenerRoutes = require('./routes/ggsroutes');

// Root route to confirm the server is running
app.get('/', (req, res) => {
    res.send('Hello, this is the LangChain server!');
});

// Use the Question Assistant routes
app.use('/api/question-assistant', questionAssistantRoutes);

// Use the Document Chat routes
app.use('/api/document-chat', docChatRoutes);

// Use the Good Government Screener routes
// app.use('/api/good-gov-screener', goodGovScreenerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
