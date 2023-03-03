/**
 * Base Element to generate the HTML component.
 */
export default class BaseElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' })
    }

    //this will be implemented by the child component.
    render() {
        return null;
    }

    onUpdate() {
        return null;
    }

    //child component will use it to rerender the component with the latest data.
    populateData() {

    }

    /**
     * This is the life cycle method of the html element, and is called when the element is added to the DOM.
     */
    connectedCallback() {
        const elem = this.render();
        this.shadowRoot.appendChild(elem);
        this.populateData();
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        if (oldValue === newValue) {
            //there is no update in the new props.
            return;
        }
        this.onUpdate(attributeName, newValue);
    }
}