window.onload = () => {
    // const workerScript = document.getElementById('worker');
    // const textContent = workerScript.textContent;
    const blob = new Blob([textContent])
    const url = URL.createObjectURL(blob)
    new Worker('./worker.js')
    VueUse.useWebWorker(() => {
        return new Worker(url)
    })
}