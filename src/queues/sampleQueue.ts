import { Queue } from "bullmq";
import redisConfig from "../config/redisConfig";

export default new Queue('SampleQueue',{connection:redisConfig});