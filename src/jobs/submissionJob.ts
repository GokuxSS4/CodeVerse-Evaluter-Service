import { Job} from "bullmq";

import { IJob } from "../types/jobDefination";
import { SubmissionPayload } from "../types/submissionPayload";
import runPythonDocker from "../containers/runPythonDocker";

export default class SubmissionJob implements IJob {
  name: string;

  payload: Record<string, SubmissionPayload>;

  constructor(payload: Record<string, SubmissionPayload>) {
    this.payload = payload;

    this.name = this.constructor.name;
  }

  handle = async (job?:Job) => {
    // console.log("Job",job);
    if(job){

        const code = this.payload.code ;
        const inputCase = this.payload.inputCases;

        const outputlogs = await runPythonDocker(code,inputCase);
        console.log(outputlogs);
    }
  };

  failed = (job?: Job): void => {
    console.log("Job failed");

    if (job) {
      console.log(job.id);
    }
  };
}
