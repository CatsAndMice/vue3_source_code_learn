const map = new Map([[1, 1]])
const freezeMap = Object.freeze(map)
console.log(freezeMap[0]=1);
console.log(freezeMap[0]);