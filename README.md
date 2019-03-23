# simpleSurvey

### To Start the server
- from the root directory
- run ```npm install```
- run ```npm start```

### Commands
- assuming that you have not set the process.env.PORT variable the following commands will work, otherwise you will need to change ```:3000``` to ```:(your port)```

- ```curl http://localhost:3000/api/v1/surveys```
  - This will return all surveys from our 'database'
  - response:
    ```js
    [
      {
        id: 5,
        name: 'Survey One',
        questions: ['Do you like robots?', 'Is your favorite color red?'],
        responses: [[false, false],[true, false],[true, true],[false, false]]
      },
      {
        id: 6,
        name: 'Another Survey',
        questions: ['Do you own a house?', 'Is your car new?'],
        responses: [[false, false],[false, false],[false, false]]
      }
    ]
    ```

- ```curl -H "Content-Type: application/json" 'http://localhost:3000/api/v1/surveys/create' -d '{"name": "Some name", "questions": ["Do you like ice cream?"]}'```
  - This will create a new survey and add it to the 'database'
  - response:
    ```js
      {
        id: 0,
        name: "Some name"
      }
    ```

- ```curl -G http://localhost:3000/api/v1/surveys/results --data-urlencode 'surveyId=5'```
  - This will return the results from a specific survey by id in a more human readable format
  - response: 
    ```js
    { 
      'Do you like robots?': { 
          yes: 2, 
          no: 2 
        }, 
      'Is your favorite color red?': { 
          yes: 1, 
          no: 3 
        } 
    }
    ```

- ```curl -G http://localhost:3000/api/v1/surveys/take --data-urlencode 'surveyId=5'```
  - This will return a singule survey by id
  - response:
    ```js
    [{
      id: 5,
      name: 'Survey One',
      questions: ['Do you like robots?', 'Is your favorite color red?'],
      responses: [[false, false],[true, false],[true, true],[false, false]]
    }]
    ```

- ```curl -H "Content-Type: application/json" http://localhost:3000/api/v1/surveys/response -d '{ "surveyId": 5, "responses": [true, false]}'```
  - This will add the responses from a survey to the 'database'
  - The only response to this is the http status code 201 (created)

### Notes
  This project is using a json file to store information. In production you could continue to use a (more robust) document store database, or you could use a SQL database (really you could use any database, but I will focus on these two). It depends on what you want to do/how you want to interact with the data. If you only want to create surveys and access the results of one survey at a time then a document store will work well. If however you would like to do things like figure out what the most answered question is, then you would be better off using a SQL db. This would allow you split the data into multiple tables where you could do things like, find the question with the most positive answers or perhaps the survey with the most positive results. You can acheive similar results with a document store either by looping over all surveys and/or indexing, however the more indexes you have the slower the db becomes. Final answer, it depends.
