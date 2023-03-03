import DynamicGrid from "./grid/index.js"

const MOCK_DATA_URL = 'https://mocki.io/v1/8591aff2-ba6f-461f-81ee-167fc94f70b9';

/**
 * Custom function to transform the cell data with better UX message
 * @param {*} cellKey 
 * @param {*} cellData 
 */
function transformCellData(cellKey, cellValue) {
    if (cellKey === 'age') {
        return `${cellValue} years old`;
    }
    return cellValue;
}

/**
 * Custom function to tranform the header text value.
 * @param {*} headerKey 
 * @param {*} headerValue 
 * @returns 
 */
function transformHeaderValue({ key, name }) {
    if (key == 'name') {
        return 'Employee Name';
    }
    return name;
}

/**
 * Render method to provide custom rendering of the header html
 * @param {*} headerKey 
 * @returns 
 */
function renderGridHeader(headerKey, headerValue) {
    return `<span>${headerValue}</span>`;
}

/**
 * custom renderer for the cell element.
 * @param {*} key 
 * @param {*} value 
 * @returns 
 */
function renderCell(key, value) {
    if (key == 'id') {
        return `<a href="javascript:void(0);" style="text-decoration:none;"><span style="color:blue;">${value}</span></a>`;
    }
    return `<span style="color:#111;">${value}</span>`;
}

/**
 * on Load event to display the dynamic grid.
 */
window.onload = function loadDynamicGrid() {
    const root = document.getElementById("root");
    fetch(MOCK_DATA_URL)
        .then(response => response.json())
        .then(data => {
            const GridComponent = new DynamicGrid({
                data,
                maxItemToShowOnPage: 7,
                transformHeaderValue,
                transformCellData,
                renderGridHeader,
                renderCell,
                cellOrderKeys: ['id', 'name', 'designation', 'company', 'age']
            });
            root.appendChild(GridComponent);
        }).catch(err => {
            const errorMessageElem = document.createElement('span');
            errorMessageElem.textContent = 'Unable to load the api , the error is ' + err.message;
            root.appendChild(errorMessageElem);
        })

}
