const deepArrayClone = (array) => {
    let deepClone = JSON.parse(JSON.stringify(array));
    return deepClone;
}

export default deepArrayClone;