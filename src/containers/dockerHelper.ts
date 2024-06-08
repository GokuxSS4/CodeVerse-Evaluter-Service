import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constant";

export default function decodeBuffer(buffer:Buffer):DockerStreamOutput{
    let offset = 0;
    
    const output = {stdout:'',stderr:''};

    while(offset<buffer.length){

          const typeOfStream = buffer[offset];

          const length = buffer.readUint32BE(offset + 4);
  
          offset += DOCKER_STREAM_HEADER_SIZE;
  
          if(typeOfStream === 1) {
              output.stdout += buffer.toString('utf-8', offset, offset + length);
          } else if(typeOfStream === 2){
              output.stderr += buffer.toString('utf-8', offset, offset + length);
          }
  
          offset += length;
    }

    return output;
}