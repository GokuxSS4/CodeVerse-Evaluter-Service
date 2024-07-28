import { Job, Worker } from 'bullmq';
import redisConfig from '../config/redisConfig';
import { submission_queue } from '../utils/constant';
import SubmissionJob from '../jobs/submissionJob';

export default function SubmissionWorker(queueName: string) {
    new Worker(
        queueName, 
        async (job: Job) => {
            if(job.name === submission_queue) {
               
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