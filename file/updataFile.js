// import Compressor from "compressorjs";
import OssHttp from "./http.js";

export default (images, { resolve, reject }) => {
    try {
        const MAX_SIZE = 1024 * 1024 * 2;
        const fileUpdate = async ({ url, fileName, formData }) => {
            let { status } = await OssHttp.fileUpdate(url, formData, {
                // headers: {
                //     "Content-Type": "multipart/form-data",
                // },
            });
            console.log(status);
            return status === 200 ? `${url}${fileName}` : null;
        }

        /**
         * 服务器签名直连
         */
        const getFormData = async (result) => {
            // 请求服务器获取阿里oss参数
            let requestResult = await OssHttp.getOssConfig('https://gateway.ywjasolar.com/todo/apis/oss/config');
            const { data } = requestResult.data
            // .${result.type.split("/")[1]}
            const fileName = `${Date.now()}`;
            const pathName = `${data.prefixFormat}${fileName}`;
            const formData = new FormData();
            console.log(result.type, result);
            formData.set("key", pathName);
            formData.set("policy", data.policy);
            formData.set("OSSAccessKeyId", data.accessId);
            formData.set("success_action_status", "200");
            formData.set("signature", data.signature);
            formData.set("name", fileName);
            const blob = new Blob([result], { type: result.type });
            formData.set("file", blob, result.name);
            return { data, formData };
        }

        const upDataImage = async (result) => {
            const { formData, data } = await getFormData(result);
            const url = await fileUpdate({ url: data.host, formData, fileName: formData.get('key') });
            resolve({ default: url, name: result.name })
        }

        const upDataSingleImage = (file) => {
            // if (gte(file.size, MAX_SIZE)) {
            // Promise.resolve().then(() => {
            //     new Compressor(file, {
            //         success(result) {
            //             console.log(result);
            //             upDataImage(result);
            //         }
            //     });
            // })
            // return;
            // }
            upDataImage(file);
        }

        upDataSingleImage(images);
    } catch (error) {
        reject(error)
    }

}