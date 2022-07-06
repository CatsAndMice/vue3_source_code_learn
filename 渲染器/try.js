function fetch() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('error')
        }, 1000)
    })
}

function load(onError) {
    const p = fetch()
    //捕获promise失败
    return p.catch((error) => {
        return new Promise((resolve, reject) => {
            const retry = () => resolve(load(onError))
            const fail = () => reject(error)
            onError(retry, fail)
        })
    })
}

load((retry,fail)=>{
    console.log(fail());
}).then(()=>{
    //成功
})