import axios from "../node_modules/axios/dist/esm/axios.js";
let instance = axios.create({
    timeout: 1000 * 60,
    withCredentials: false,
})

instance.defaults.validateStatus = status => {
    return /^200$/.test(status)
}

instance.interceptors.request.use(config => {
    config.headers.Authorization = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6MTI2LCJ0ZW5hbnRJZCI6MSwidXNlcklkIjoyNzA4NDI5NzE5OTIxOTcsImpvYk51bWJlciI6IllXMTA1MzYiLCJ1c2VybmFtZSI6IuabvuaFp-aFpyJ9.NMGt3_TB-bBkC-nfRH1d6NrxysY-CR6uxykjkzaOKkE"
    return config
}, err => {
    return Promise.reject(err)
})

instance.interceptors.response.use(res => {
    return res
}, err => {
    console.log(err);
    if (window.navigator.onLine) {
        bottomToast('error', '上传失败,请重新上传!')
        return
    }
    bottomToast('error', '网络连接不可用,请检查网络!')
    console.warn(err)
})

class OssHttp {
    async getOssConfig(url, data, config) {
        return await instance.get(url, data, config)
    }

    async fileUpdate(url, data, config) {
        return await instance.post(url, data, {
            ...config, onUploadProgress: (res) => {
                console.log(res);
            }
        })
    }
}

export default new OssHttp()