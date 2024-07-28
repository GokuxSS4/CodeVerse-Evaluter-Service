import { submission_queue } from './../utils/constant';
import submissionQueue from '../queues/submissionQueue';

export default async function(payload: Record<string, unknown>) {
    await submissionQueue.add(submission_queue, payload);
}