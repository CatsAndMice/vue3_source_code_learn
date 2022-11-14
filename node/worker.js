const { Worker, workerData, isMainThread, parentPort, threadId, } = require("node:worker_threads")
console.log(isMainThread,threadId);
if (isMainThread) {
    const worker = new Worker(__filename, { workerData: 'worker' })
    worker.postMessage('我是父线程')
} else {
    parentPort.postMessage('我是子线程')
    parentPort.on('message',(e)=>{
        console.log(e);

    })
    console.log(workerData);
}
