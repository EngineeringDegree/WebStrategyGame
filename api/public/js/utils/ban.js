/**
 * Creates dom elemnt which makes ban utility for admin
 * @returns {DOMElement} which is ban utility for admin
 */
function createBanUtility(id){
    let util = document.createElement('p')
    util.textContent = `BANHAMMER ${id}`
    return util
}