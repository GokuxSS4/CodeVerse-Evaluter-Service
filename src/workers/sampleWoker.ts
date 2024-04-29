import { Job, Worker } from 'bullmq';
import redisConfig from '../config/redisConfig';
import SampleJob from '../jobs/sampleJobs';


export default function SampleWorker(queueName: string) {
    new Worker(
        queueName, 
        async (job: Job) => {
            if(job.name === "SampleJob") {
                console.log(job.data);
                const sampleJobInstance = new SampleJob(job.data);

                sampleJobInstance.handle();

                return true;
            }
        },
        {
            connection: redisConfig
        }
    );
}