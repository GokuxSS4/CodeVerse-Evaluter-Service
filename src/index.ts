import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import SampleWorker from "./workers/sampleWoker";
import sampleProducer from "./producers/sampleProducer";


const app: Express = express();

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *:${serverConfig.PORT}`);

  SampleWorker('SampleQueue');

  sampleProducer('SampleJob', {
    name: "Tom",
    age: 20  
  });
});


