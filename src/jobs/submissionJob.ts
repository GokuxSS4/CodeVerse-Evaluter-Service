import { Job } from "bullmq";
import { IJob } from "../types/jobDefination";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../containers/executorFactory";
import { ExecutionResponse } from "../types/codeExecutorStatagy";



export default class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, SubmissionPayload>;
    constructor(payload: Record<string, SubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handle = async (_job?: Job) => {
        console.log("Handler of the submit job called");
        console.log(this.payload);
        // if(job) {
            const key = Object.keys(this.payload)[0];
            const codeLanguage = this.payload[key].language;
            const code = this.payload[key].code;
            // TODO: handle multiple test cases
            const inputTestCase = this.payload[key].inputCases;
            const outputTestCase = this.payload[key].outputCases;
            const strategy = createExecutor(codeLanguage);

            console.log("Stategu,language",strategy,codeLanguage);
            if(strategy != null) {
                const response : ExecutionResponse = await strategy.execute(code, inputTestCase,outputTestCase);
                if(response.status === "COMPLETED") {
                    console.log("Code executed successfully");
                    console.log(response);
                } else {
                    console.log("Something went wrong with code execution");
                    console.log(response);
                }
            // }
        }
    };

    failed = (job?: Job) : void => {
        console.log("Job failed");
        if(job) {
            console.log(job.id);
        }
    };
}