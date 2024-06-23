const axios = require('axios');

// Route to generate answers using Langraph (actual implementation)
router.post('/generate-answers', async (req, res) => {
    const { questionnaireId, documentPath } = req.body;
    const questionnaire = questionnaires.find(q => q.id === questionnaireId);

    if (!questionnaire) {
        return res.status(404).json({ error: 'Questionnaire not found' });
    }

    try {
        const responses = await Promise.all(
            questionnaire.questions.map(question =>
                axios.post('https://api.langraph.com/generate', {
                    question,
                    documentPath
                })
            )
        );

        questionnaire.answers = responses.map((response, index) => ({
            question: questionnaire.questions[index],
            answer: response.data.answer
        }));

        res.json(questionnaire);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate answers' });
    }
});
