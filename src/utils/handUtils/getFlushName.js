/**
 * Gets array of color occurances, if one color occurs more or equal 5 times, flush is recorded
 * @param {array} colors
 * @returns {string} returns name of the flush 
 */
const getFlushName = (colors) => {
    let flush;
    colors.forEach(color => {
        if(color[1] >= 5) {
            flush = color[0];
        } 
    })
    
    return flush;
} 

export default getFlushName;