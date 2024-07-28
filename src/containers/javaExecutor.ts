import { JAVA_IMAGE } from "../utils/constant";
import createContainer from './containerFactory';
import pullImage from './pullImages';

import CodeExecutorStrategy, { ExecutionResponse } from './../types/codeExecutorStatagy';
import decodeBuffer from "./dockerHelper";


export default class JavaExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string,outputTestCase:string) : Promise<ExecutionResponse>{
        const rawLogBuffer: Buffer[] = [];

        console.log(code, inputTestCase, outputTestCase);

        await pullImage(JAVA_IMAGE);
    
        console.log("Initialising a new java docker container");
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
        console.log(runCommand);
        const javaDockerContainer = await createContainer(JAVA_IMAGE, [
            '/bin/sh', 
            '-c',
            runCommand
        ]); 
    
    
        // starting / booting the corresponding docker container
        await javaDockerContainer.start();
    
        console.log("Started the docker container");
    
        const loggerStream = await javaDockerContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true // whether the logs are streamed or returned as a string
        });


        try {
            const codeResponse : string = await this.fetchDecodeStream(loggerStream, rawLogBuffer);
            return {output: codeResponse, status: "COMPLETED"};
        } catch (error) {
            return {output: error as string, status: "ERROR"}
        } finally {
            await javaDockerContainer.remove();
        }

    }

    fetchDecodeStream(loggerStream:NodeJS.ReadableStream,rowLogBuffer: Buffer[]):Promise<string> {
        loggerStream.on('data',(chunk: Buffer)=>{
            rowLogBuffer.push(chunk);
        })
    

        return new Promise((resolve,reject)=>{
            loggerStream.on('end',()=>{
                const completeBuffer = Buffer.concat(rowLogBuffer);
                const decodedLog = decodeBuffer(completeBuffer);
                if(decodedLog.stderr){
                    reject(decodedLog.stderr);
                }
                if(decodedLog.stdout){
                    resolve(decodedLog.stdout);
                }
            });
        })
    
    }
}
