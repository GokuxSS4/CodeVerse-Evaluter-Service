import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
// import SampleWorker from "./workers/sampleWoker";
// import sampleProducer from "./producers/sampleProducer";
import runPythonDocker from "./containers/runPythonDocker";

const app: Express = express();

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *:${serverConfig.PORT}`);

  // SampleWorker('SampleQueue');

  // sampleProducer('SampleJob', {
  //   name: "Tom",
  //   age: 20  
  // });

  const code = `x = input()
y = input()
print("value of x is", x)
print("value of y is", y)
`;
  
const inputCase = `100
200
`;
  
  runPythonDocker(code, inputCase);
});


