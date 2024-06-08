import Docker from "dockerode";


export default async function createDockerContainer(dockerImageName:string,cmdToRun:string[]){
    const docker = new Docker();

    const dockerContainer  =  await docker.createContainer({
        Image:dockerImageName,
        AttachStdin:true,
        AttachStdout:true,
        AttachStderr:true,
        Cmd:cmdToRun,
        Tty: false,
        OpenStdin: true // keep the input stream open even no interaction is there
    });

    return dockerContainer;
}