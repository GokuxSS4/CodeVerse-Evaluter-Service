import { PYTHON_IMAGE } from "../utils/constant";
import createDockerContainer from "./containerFactory";
import decodeBuffer from "./dockerHelper";

export default async function runPythonDocker(code:string,inputTestCase:string){

    const rowLogBuffer: Buffer[] = [];

    console.log("Start to create container");
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


    await new Promise<void> ((resolve)=>{
        loggerStream.on('end',()=>{
            const completeBuffer = Buffer.concat(rowLogBuffer);
            const decodedLog = decodeBuffer(completeBuffer);
            console.log(decodedLog);
            resolve();
        });
    })

    await pythonContainer.remove();
    // return pythonContainer;
}