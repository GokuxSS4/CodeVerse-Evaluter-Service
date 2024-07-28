import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import { serverAdapter } from "./config/bullBoardConfig";
import SubmissionWorker from "./workers/submissionWorker";
import { submission_queue } from './utils/constant';

// import SampleWorker from "./workers/sampleWoker";
// import sampleProducer from "./producers/sampleProducer";
// import SubmissionWorker from "./workers/submissionWorker";
// import { SUBMISSION_QUEUE_NAME } from "./utils/constant";
// import submissionProducer from "./producers/submissionProducer";
// import { SubmissionPayload } from "./types/submissionPayload";
// import runPythonDocker from "./containers/runPythonDocker";

const app: Express = express();

app.use('/admin/queues', serverAdapter.getRouter());
app.use('/api', apiRouter);


app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *:${serverConfig.PORT}`);


  SubmissionWorker(submission_queue);

  // sampleProducer('SampleJob', {
  //   name: "Tom",
  //   age: 20  
  // });

//   const requestData:SubmissionPayload = {
//     code:`x = input()
// y = input()
// print("value of x is", x)
// print("value of y is", y)
// `,
//     language: 'python',
//     inputCases: `100
// 200
// `
//   }

//   SubmissionWorker(SUBMISSION_QUEUE_NAME);

//   submissionProducer(requestData);



//   const code = `x = input()
// y = input()
// print("value of x is", x)
// print("value of y is", y)
// `;
  
// const inputCase = `100
// 200
// `;
  
//   runPythonDocker(code, inputCase);
});


