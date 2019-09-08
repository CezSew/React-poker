/**
 * Return index of item in multidimensional array that matches the inner array val of given index
 * @param {array} array 
 * @param {array} item
 * @param {number} checkIndex an index of inner-dimension of an array 
 */
const findValueIndexInMultidimensionalArray = (array, item, checkIndex) => {
    let result = -1;
    array.forEach( (el, index) => {
        if(el[checkIndex] === item) {
            result = index;
        }
    })

    return result;
} 

export default findValueIndexInMultidimensionalArray;