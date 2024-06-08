import { Queue } from "bullmq";
import redisConfig from "../config/redisConfig";
import { SUBMISSION_QUEUE_NAME } from "../utils/constant";

export default new Queue(SUBMISSION_QUEUE_NAME,{connection:redisConfig});