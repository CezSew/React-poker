const createPlayerArrayFromObject = (object) => {
    let result = Object.keys(object).map((item) => {
        return [item, object[item]];
      });
    return result;
}

export default createPlayerArrayFromObject;