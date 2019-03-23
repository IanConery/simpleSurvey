const fs = require('fs');
const _ = require('lodash');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

exports.checkForMissingAgs = (queryObj, required) => {
  const missingArgs = _.compact(required.map((arg) => {
    if (!queryObj[arg]) {
      return arg;
    }
  }));

  return missingArgs.length > 0 ? `Argument(s) missing: ${missingArgs.join(', ')}` : null;
};

exports.addSurvey = async (filePath, content) => {
  const data = await this.getSurveys(filePath);
  data.push(content);
  await writeFile(filePath, JSON.stringify(data));
};

exports.getResultsById = async (filePath, id) => {
  const results = {};
  const { questions, responses } = await this.getSurveyById(filePath, id);

  for (let i = 0; i < questions.length; i++) {
    const currentQuestion = questions[i];
    const answers = { yes: 0, no: 0 };
    for (let k = 0; k < responses.length; k++) {
      responses[k][i] ? answers.yes++ : answers.no++;
    }
    results[currentQuestion] = answers;
  }

  return results;
};

exports.getSurveyById = async (filePath, id) => {
  const data = await this.getSurveys(filePath);
  const survey = data.filter((surveyObj) => surveyObj.id.toString() === id);
  if (survey.length === 0){
    throw new Error(`No survey exists with id: ${id}`);
  } else {
    return survey[0];
  }
};

exports.getSurveys = async (filePath) => {
  const surveys = await readFile(filePath, 'utf8');
  return JSON.parse(surveys);
};

exports.addResponsesToSurvey = async (filePath, surveyId, results) => {
  const check = await this.getSurveyById(filePath, surveyId); // also neccessary because of my 'database'
  const data = await this.getSurveys(filePath);
  const updated = data.map((survey) => {
    const { id, questions } = survey;
    if (id === surveyId) {
      if (questions.length < results.length) {
        throw new Error(`You have provided too many answers. Questions: ${questions}, Answers: ${results}`);
      }
      survey.responses.push(results);
    }
    return survey
  });
  await writeFile(filePath, JSON.stringify(updated));
};
