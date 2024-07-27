import { Queue } from "bullmq";
import redisConfig from "../config/redisConfig";
import { submission_queue } from "../utils/constant";

export default new Queue(submission_queue,{connection:redisConfig});