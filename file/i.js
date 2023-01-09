const axios = require("axios")
let obj = null
const credentials = async () => {
    let result = await axios.get("https://segmentfault.com/q/1010000043274376/a-1020000043274448?_ea=286738391")
    module.exports = result
}

credentials();
// (() => {
//     const axios = require("axios")
//     const credentials = async () => {
//         let result = await axios.get("https://segmentfault.com/q/1010000043274376/a-1020000043274448?_ea=286738391")

//     }

//     credentials()

//     module.exports = result
// })()