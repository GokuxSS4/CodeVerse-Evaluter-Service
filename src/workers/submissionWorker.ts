import { Job, Worker } from 'bullmq';
import redisConfig from '../config/redisConfig';
import { SUBMISSION_QUEUE_NAME } from '../utils/constant';
import SubmissionJob from '../jobs/submissionJob';

export default function SubmissionWorker(queueName: string) {
    new Worker(
        queueName, 
        async (job: Job) => {
            if(job.name === SUBMISSION_QUEUE_NAME) {
               
                const sampleJobInstance = new SubmissionJob(job.data);

                await sampleJobInstance.handle(job);

                return true;
            }
        },
        {
            connection: redisConfig
        }
    );
}