import BaseElement from "../base/BaseElement.js";
import { htmlToElement } from "../helper/util.js";

export default class PaginationElement extends BaseElement {
    constructor({ maxItemToShowOnPage, currentPage, totalElement, onPageChangeEvent }) {
        super();
        this.props = {
            maxItemToShowOnPage,
            currentPage,
            totalElement,
            onPageChangeEvent
        }
        this.generatePageNumber = this.generatePageNumber.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.loadPreviousPage = this.loadPreviousPage.bind(this);
        this.loadSpecificPage = this.loadSpecificPage.bind(this);
        this.generatePageNumber();
    }

    generatePageNumber() {
        this.pageArray = [];
        let pageIndex = 1;
        while (((pageIndex - 1) * this.props.maxItemToShowOnPage) < this.props.totalElement) {
            this.pageArray.push(pageIndex);
            pageIndex++;
        }
    }

    static get observedAttributes() {
        return ['currentpage', 'totalelement'];
    }

    /**
     * @param {number} val
     */
    set setCurrentPage(val) {
        this.setAttribute('currentpage', val);
    }

    get getCurrentPage() {
        return this.getAttribute('currentpage');
    }

    /**
     * @param {number} val
     */
    set setTotalelement(val) {
        this.setAttribute('totalelement', val);
    }

    get getTotalelement() {
        return this.getAttribute('totalelement');
    }

    loadPreviousPage() {
        if (this.props.currentPage > 1) {
            this.props.onPageChangeEvent?.(this.props.currentPage - 1);
        }
    }

    loadNextPage() {
        if (this.props.currentPage < this.pageArray[this.pageArray.length - 1]) {
            this.props.onPageChangeEvent?.(this.props.currentPage + 1);
        }
    }

    loadSpecificPage(event) {
        this.props.onPageChangeEvent?.(event.target.value);
    }

    onUpdate(attributeName, value) {
        if (attributeName === 'currentpage') {
            this.props.currentPage = Number(value);
            this.populateData();
        }
        else if (attributeName === 'totalelement') {
            this.props.totalElement = Number(value);
            this.generatePageNumber();
            this.populateData();
        }
    }

    render() {
        const pageElement = document.createElement('div');
        const pageHTML = `
            <style>
                .pagination {
                    display: inline-block;
                }
                button {
                    padding:5px 10px 5px 10px;
                    margin:4px;
                    font-weight:bold;
                    border : 1px solid;
                    cursor:pointer;
                }
                .selectecdButton {
                    background-color:aqua;
                }
                button:hover {
                    opacity:.40;
                }
            </style>
            <div class="paginationContainer">
                <button id="prev-button">❮</button>
                <div id="grid-page-number" class="pagination"></div>
                <button id="next-button">❯</button>
            </div >
        `;
        pageElement.innerHTML = pageHTML;
        const previousButton = pageElement.querySelector("#prev-button");
        const nextButton = pageElement.querySelector("#next-button");
        previousButton.addEventListener('click', this.loadPreviousPage);
        nextButton.addEventListener('click', this.loadNextPage);
        return pageElement;
    }

    populateData() {
        const numberContainer = this.shadowRoot.querySelector('#grid-page-number');
        numberContainer.replaceChildren();
        this.pageArray.map(page => {
            const pageNumberButton = document.createElement('button');
            pageNumberButton.textContent = `${page}`;
            pageNumberButton.value = page;
            if (page === this.props.currentPage) {
                pageNumberButton.setAttribute('class', 'selectecdButton');
            }
            // pageNumberButton.style.color = page == this.props.currentPage ? '#FF0000' : '#000000';
            pageNumberButton.addEventListener('click', this.loadSpecificPage);
            numberContainer.appendChild(pageNumberButton);
        })

        //enable/disable previous and next button state.
        const previousButton = this.shadowRoot.querySelector("#prev-button");
        const nextButton = this.shadowRoot.querySelector("#next-button");
        previousButton.disabled = this.props.currentPage == 1;
        nextButton.disabled = this.props.currentPage == this.pageArray[this.pageArray.length - 1];
    }

}

customElements.define('grid-pagination', PaginationElement);