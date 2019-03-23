const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const {
  addSurvey,
  getSurveyById,
  getResultsById,
  getSurveys,
  addResponsesToSurvey,
  checkForMissingAgs
} = require('./server/serverHelpers.js');

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// neccessary evils for my 'database'
const dbPath = './server/mockDb.json';
let surveyId = 0;

// get all surveys
app.get('/api/v1/surveys', async (req, res) => {
  try {
    const data = await getSurveys(dbPath);
    res.status(200).json(data);
  } catch(error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// create a new survey
app.post('/api/v1/surveys/create', async (req, res) => {
  const errorText = checkForMissingAgs(req.body, ['questions', 'name']);
  if (errorText) return res.status(400).send(errorText);

  const { questions, name } = req.body;
  const id = surveyId;
  const surveyObj = {
    id,
    name,
    questions,
    responses: []
  };
  try {
    await addSurvey(dbPath, surveyObj);
    surveyId++;
    res.status(201).json({ id, name });
  } catch(error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// get the results of a single survey
app.get('/api/v1/surveys/results', async (req, res) => {
  const errorText = checkForMissingAgs(req.query, ['surveyId']);
  if (errorText) return res.status(400).send(errorText);

  const { surveyId } = req.query;
  try {
    const surveyResults = await getResultsById(dbPath, surveyId);
    res.status(200).json(surveyResults);
  } catch(error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// get a singular survey
app.get('/api/v1/surveys/take', async (req, res) => {
  const errorText = checkForMissingAgs(req.query, ['surveyId']);
  if (errorText) return res.status(400).send(errorText);

  const { surveyId } = req.query;
  try {
    const survey = await getSurveyById(dbPath, surveyId);
    res.status(200).json(survey);
  } catch(error) {
    console.error(error);
    res.status(500).send(error);
  }
});
// post the responses to the questions from taking a survey
app.post('/api/v1/surveys/response', async (req, res) => {
  const errorText = checkForMissingAgs(req.body, ['responses', 'surveyId']);
  if (errorText) return res.status(400).send(errorText);

  const { responses, surveyId } = req.body;
  try {
    await addResponsesToSurvey(dbPath, surveyId, responses);
    res.sendStatus(201);
  } catch(error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Connection successfull:\nServer listening on port ${port}`);
});