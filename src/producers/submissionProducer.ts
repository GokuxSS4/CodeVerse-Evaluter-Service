import { SUBMISSION_QUEUE_NAME } from './../utils/constant';
import submissionQueue from '../queues/submissionQueue';

export default async function(payload: Record<string, unknown>) {
    await submissionQueue.add(SUBMISSION_QUEUE_NAME, payload);
}