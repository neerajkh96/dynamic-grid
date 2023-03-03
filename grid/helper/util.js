/**
 * This will generate HTML element from the html string.
 * @param {*} html 
 */
export function htmlToElement(html){
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}