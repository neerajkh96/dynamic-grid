import BaseElement from "../base/BaseElement.js";
import { htmlToElement } from "../helper/util.js";

export default class HeaderElement extends BaseElement {
    constructor({ header, renderGridHeader, transformHeaderValue }) {
        super();
        this.props = {
            header,
            renderGridHeader,
            transformHeaderValue
        };
    }

    render() {
        const transformValue = this.props.transformHeaderValue?.(this.props.header) || this.props.header.name;
        const transformedHTML = this.props.renderGridHeader?.(this.props.header.key, transformValue);
        if (transformedHTML) {
            return htmlToElement(transformedHTML);
        }
        else {
            const th = document.createElement('div');
            th.innerHTML = `
                <div class="gridHeadingCell">
                ${transformValue}
                </div>
            `;
            return th;
        }
    }
}

customElements.define('grid-header', HeaderElement);