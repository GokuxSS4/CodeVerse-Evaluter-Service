import { PYTHON_IMAGE } from "../utils/constant";
import createDockerContainer from "./containerFactory";
import decodeBuffer from "./dockerHelper";

import CodeExecutorStrategy, { ExecutionResponse } from './../types/codeExecutorStatagy';

export default class PythonExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string,outputTestCase:string) : Promise<ExecutionResponse>{
        const rowLogBuffer: Buffer[] = [];

        console.log("Start to create container");
        console.log(code, inputTestCase, outputTestCase);
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
        const pythonContainer = await createDockerContainer(PYTHON_IMAGE, [
            '/bin/sh', 
            '-c',
            runCommand
        ]);
       
        await pythonContainer.start();
    
        console.log("Booting the container");
     
    
        const loggerStream = await pythonContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true // whether the logs are streamed or returned as a string
        });
    
        loggerStream.on('data',(chunk: Buffer)=>{
            rowLogBuffer.push(chunk);
        })
    
        try {
            const codeResponse : string = await this.fetchDecodeStream(loggerStream, rowLogBuffer);
            return {output: codeResponse, status: "COMPLETED"};
        } catch (error) {
            return {output: error as string, status: "ERROR"}
        } finally {
            await pythonContainer.remove();
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

