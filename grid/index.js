import BaseElement from "./base/BaseElement.js";
import GridCellElement from "./components/GridCell.js";
import HeaderElement from "./components/Header.js";
import PaginationElement from "./components/Pagination.js";

/**
 * This is the Dynmaic Grid UI component.
 * The following input are supported by the component.
 * 
 * {
 *      data : JSON Object or Array
 *      transformCellData: (cellKey, cellValue)=>{} //callback to evaluate on the cell value
 *      renderGridHeader : (headerKey)=> {} //callback to provide the custom render of the header.
 *      renderCell : (cellKey, cellTransformedValue)=> {} //callback to provide the customer render for the cell value.
 *      maxItemToShowOnPage: number // number to display the item in a single page. this will be used to enable pagination.
 *      cellOrderKeys : JSON Array of the header keys.
 * }
 * 
 * @returns HTML Generated Component 
 */

export default class DynamicGrid extends BaseElement {
    constructor({
        transformHeaderValue,
        transformCellData,
        renderGridHeader,
        cellOrderKeys,
        renderCell,
        data,
        maxItemToShowOnPage
    }) {
        super();
        this.props = {
            transformHeaderValue,
            transformCellData,
            renderGridHeader,
            cellOrderKeys,
            renderCell,
            data: {
                headers: data.headers,
                rowData: data.rowData
            },
            maxItemToShowOnPage
        };
        this.headers = [];
        //Arranging the column basis on the given order in props
        this.props.cellOrderKeys.map(key => {
            const header = this.props.data.headers.find(item => item.key === key);
            if (header) {
                this.headers.push(header);
            }
        })
        this.filteredData = this.props.data.rowData;
        this.currentPage = 1; //the current selected page number.
        this.onPageChangeEvent = this.onPageChangeEvent.bind(this);
        this.onFilterData = this.onFilterData.bind(this);
    }

    static get observedAttributes() {
        return ['currentpage', "filtereddata"]
    }

    /**
     * @param {string} val
     */
    set setCurrentpage(val) {
        this.setAttribute('currentpage', val);
    }

    get getCurrentpage() {
        return this.getAttribute('currentpage');
    }

    /**
     * @param {any} val
     */
    set setFiltereddata(val) {
        this.setAttribute('filtereddata', JSON.stringify(val));
    }

    get getFiltereddata() {
        return JSON.parse(this.getAttribute('filtereddata'))
    }

    /**
     * This will be invoked whenever there is any attribuate changed for the grid and the rerendering is required.
     * @param {*} attributeName 
     * @param {*} value 
     */
    onUpdate(attributeName, value) {
        if (attributeName == 'currentpage') {
            this.currentPage = Number(value);
            this.populateData();
        } else if (attributeName == 'filtereddata') {
            this.currentPage = 1;
            this.populateData();
        }
    }

    /**
     * This will define the actual template of the component.
     * @returns 
     */
    render() {
        const gridWrapper = document.createElement('div');
        gridWrapper.innerHTML = `
            <link rel="stylesheet" href= './grid/style.css'>
            <div class="container">
                <table class="grid-header-table">
                    <thead>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div id="grid-page-container" class="pageContainer">
                </div>
            </div>
        `;
        //Add Grid-header element
        const tableHeadlerElem = gridWrapper.querySelector('thead');
        let tr = document.createElement('tr');
        this.headers.map(header => {
            const th = document.createElement('th');
            th.setAttribute("class", "sortable");
            const headerElement = new HeaderElement({
                header,
                renderGridHeader: this.props.renderGridHeader,
                transformHeaderValue: this.props.transformHeaderValue
            });
            th.appendChild(headerElement);
            tr.appendChild(th);
        })
        tableHeadlerElem.appendChild(tr);

        tr = document.createElement('tr');
        const th = document.createElement('th');
        th.setAttribute('colspan', this.headers.length);
        const input = document.createElement('input');
        input.placeholder = 'Search with any field'
        input.addEventListener('change', this.onFilterData);
        th.appendChild(input);
        tr.appendChild(th);
        tableHeadlerElem.appendChild(tr);
        //Add pagination component
        if (this.filteredData.length > this.props.maxItemToShowOnPage) {
            const paginationElem = gridWrapper.querySelector('#grid-page-container');
            this.paginationComponent = new PaginationElement({
                maxItemToShowOnPage: this.props.maxItemToShowOnPage,
                currentPage: this.currentPage,
                totalElement: this.filteredData.length,
                onPageChangeEvent: this.onPageChangeEvent
            });
            paginationElem.appendChild(this.paginationComponent);
        }
        return gridWrapper;
    }

    /**
     * This will populate the data in the template defined in the render method.
     */
    populateData() {
        //populate pagination details
        const paginationElement = this.shadowRoot.querySelector('grid-pagination');
        paginationElement?.setAttribute('currentpage', this.currentPage);
        paginationElement?.setAttribute('totalelement', this.filteredData.length);

        //update Grid-Body element
        const tableRowDataElem = this.shadowRoot.querySelector('tbody');
        tableRowDataElem.replaceChildren();
        const arrayStartingIndex = (this.currentPage - 1) * this.props.maxItemToShowOnPage;
        const arrayEndIndex = arrayStartingIndex + this.props.maxItemToShowOnPage;
        this.filteredData.slice(arrayStartingIndex, arrayEndIndex).map(cellData => {
            const tr = document.createElement('tr');
            tr.setAttribute("scope", "row");
            this.props.cellOrderKeys.map(key => {
                const td = document.createElement('td');
                const cellElement = new GridCellElement({
                    value: cellData[key],
                    key,
                    transformCellData: this.props.transformCellData,
                    renderCell: this.props.renderCell
                });
                td.appendChild(cellElement);
                tr.appendChild(td);
            })
            tableRowDataElem.appendChild(tr);
        });
    }

    /**
     * This event will be called when the page is selcted from the pagination container.
     * @param {*} pageIndex 
     */
    onPageChangeEvent(pageIndex) {
        this.setAttribute('currentpage', pageIndex);
    }

    /**
     * This wil filter the grid based on the search string.
     * @param {*} event 
     */
    onFilterData(event) {
        const searchedString = event.target.value;
        if (searchedString) {
            const filteredData = this.props.data.rowData.filter(data => {
                const keys = Object.keys(data);
                for (let i = 0; i < keys.length; i++) {
                    if (`${data[keys[i]]}`.includes(searchedString)) {
                        return true;
                    }
                }
                return false;
            })
            this.filteredData = filteredData;
            this.setAttribute('filtereddata', filteredData);
        }
        else {
            this.filteredData = this.props.data.rowData;
            this.removeAttribute('filtereddata');
        }
    }
}

customElements.define("dynamic-grid", DynamicGrid);