import BaseElement from "../base/BaseElement.js";

export default class GridCellElement extends BaseElement {
    constructor({ transformCellData, renderCell, key, value }) {
        super();
        this.props = {
            transformCellData,
            renderCell,
            key,
            value
        };
    }

    render() {
        const cellElem = document.createElement('div');
        const { key, value } = this.props;
        let transformedCellValue = this.props.transformCellData?.(key, value) || value;
        let transformedHTML = this.props.renderCell?.(key, transformedCellValue);
        if (transformedHTML) {
            cellElem.innerHTML = transformedHTML;
        }
        else {
            cellElem.innerHTML = `
                ${transformedCellValue}
                `;
        }
        return cellElem;
    }
}

customElements.define('grid-cell', GridCellElement);