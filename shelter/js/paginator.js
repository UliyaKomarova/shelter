const catalogList = document.querySelector('.catalog-list');
const catalogItemClass = 'catalog-item';
const catalogItemAttributeName = 'data-id';
const buttonFirst = document.querySelector('.button-first');
const buttonPrev = document.querySelector('.button-prev');
const buttonActive = document.querySelector('.catalog-nav-item.button-active');
const buttonNext = document.querySelector('.button-next');
const buttonLast = document.querySelector('.button-last');
const buttonDisabledClass = 'button-disabled';

let animalsData;
let longAnimalData;
let longAnimalDataLength;
let countItemsPerPage;
let currentPage = 0;
let windowSize = () => document.documentElement.clientWidth;

window.addEventListener('resize', () => {
    let oldCountItemsPerPage = countItemsPerPage;

    countItemsPerPage = getCountItemsPerPage();
    if (oldCountItemsPerPage !== countItemsPerPage) {
        
    }
});

let getCountItemsPerPage = () => {
    let count;
    let width = windowSize();

    if (width > 1200) {
        count = 8;
    } else if ((768 <= width) && (width <= 1200)) {
        count = 6;
    } else {
        count = 3;
    }

    return countItemsPerPage = count;
};

// call popup
catalogList.onclick = function(event) {
    let catalogItem = event.target.closest('.' + catalogItemClass);
    let animalsDataItemId;

    if (!catalogItem) return;

    animalsDataItemId = catalogItem.getAttribute(catalogItemAttributeName);
    for (i = 0; i < animalsData.length; i+=1) {
        if (animalsData[i].id === animalsDataItemId) {
            showPopup(animalsData[i]);
            return;
        }
    }
};

const addCatalogItemsOnPage = (animalsDataToShow) => {
    let htmlCatalogBlock = '';

    for (i = 0; i < animalsDataToShow.length; i+=1) {
        htmlCatalogBlock = htmlCatalogBlock + `<li class="${catalogItemClass}" ${catalogItemAttributeName}="${animalsDataToShow[i].id}">
                                            <img
                                                class="catalog-item-img"
                                                src="${animalsDataToShow[i].img}"
                                                alt="${animalsDataToShow[i].name}"
                                            />
                                            <span class="catalog-item-name">${animalsDataToShow[i].name}</span>
                                            <div class="catalog-item-button">
                                                <div class="button light">
                                                    <span class="button-text">Learn more</span>
                                                </div>
                                            </div>
                                        </li>`;
    }
    catalogList.innerHTML = htmlCatalogBlock;
};

const chooseItemsToShow = (longAnimalData, countItemsPerPage, currentPage) => {
    let startItem = countItemsPerPage * currentPage;
    let lastItem = startItem + countItemsPerPage;

    const animalsDataToShow = longAnimalData.slice(startItem, lastItem);
    return animalsDataToShow;
}

const createLongAnimalsData = (animalsData) => {
    let longAnimalData = [];
    let data;
                    let shuffledAnimalData = [];

                    for (let key in animalsData) {
                        shuffledAnimalData[key] = animalsData[key];
                    }

                    let dataLength = shuffledAnimalData.length, x, y;
                    while (dataLength) {
                        y = Math.floor(Math.random() * dataLength--);
                        x = shuffledAnimalData[dataLength];
                        shuffledAnimalData[dataLength] = shuffledAnimalData[y];
                        shuffledAnimalData[y] = x;
                    }

    for (i = 0; i < 6; i+=1) {
        // if (i === 0) {
        //     data = animalsData;
        // } else {
        //     data = shuffledAnimalData;
        //     shuffledAnimalData.reverse();
        // }
        data = shuffledAnimalData;
        shuffledAnimalData.reverse();
        longAnimalData = longAnimalData.concat(data);
    }
    longAnimalDataLength = longAnimalData.length;
    return longAnimalData;
};

const findPage = (currentPage, direction, countItemsPerPage) => {
    let page;

    switch (direction) {
        case 'first':
            page = 0;
            break;

        case 'last':
            page = (longAnimalDataLength / countItemsPerPage) - 1;
            break;

        case 'prev':
            page = currentPage - 1;
            break;

        case 'next':
            page = currentPage + 1;
            break;
    }

    return page;
}

const removeDisabledClassNextAndLast = () => {
    buttonNext.classList.remove(buttonDisabledClass);
    buttonLast.classList.remove(buttonDisabledClass);
};

const removeDisabledClassPrevAndFirst = () => {
    buttonFirst.classList.remove(buttonDisabledClass);
    buttonPrev.classList.remove(buttonDisabledClass);
};

const addDisabledClassNextAndLast = () => {
    buttonLast.classList.add(buttonDisabledClass);
    buttonNext.classList.add(buttonDisabledClass);
}

const addDisabledClassPrevAndFirst = () => {
    buttonPrev.classList.add(buttonDisabledClass);
    buttonFirst.classList.add(buttonDisabledClass);
}

const paginate = (direction) => {
    let animalsDataToShow;
    let lastPage = longAnimalDataLength / countItemsPerPage;
    
    currentPage = findPage(currentPage, direction, countItemsPerPage);
    buttonActive.children[0].innerText = currentPage + 1;

    switch (direction) {
        case 'prev':
            if (buttonLast.classList.contains(buttonDisabledClass)) {
                removeDisabledClassNextAndLast();
            }
            if (currentPage === 0) {
                addDisabledClassPrevAndFirst();
            }
            break;
        case 'next':
            if (buttonFirst.classList.contains(buttonDisabledClass)) {
                removeDisabledClassPrevAndFirst();
            }
            if (currentPage + 1 === lastPage) {
                addDisabledClassNextAndLast();
            }
            break;
        case 'last':
            addDisabledClassNextAndLast();
            if (buttonFirst.classList.contains(buttonDisabledClass)) {
                removeDisabledClassPrevAndFirst();
            }
            break;
        case 'first':
            addDisabledClassPrevAndFirst();
            if (buttonLast.classList.contains(buttonDisabledClass)) {
                removeDisabledClassNextAndLast();
            }
            break;
    }
    animalsDataToShow = chooseItemsToShow(longAnimalData, countItemsPerPage, currentPage);
    addCatalogItemsOnPage(animalsDataToShow);
};

buttonFirst.addEventListener('click', () => paginate('first'));
buttonPrev.addEventListener('click', () => paginate('prev'));
buttonNext.addEventListener('click', () => paginate('next'));
buttonLast.addEventListener('click', () => paginate('last'));

const getJsonData = async () => {
    const response = await fetch('../../js/slider-data.json');
    if (!response.ok) {
        console.log('No slider data has been received');
    }
    return await response.json();
};

const initPaginator = async () => {
    // get animals data
    animalsData = await getJsonData();

    longAnimalData = createLongAnimalsData(animalsData);

    countItemsPerPage = getCountItemsPerPage();

    animalsDataToShow = chooseItemsToShow(longAnimalData, countItemsPerPage, currentPage);

    addCatalogItemsOnPage(animalsDataToShow);
};

initPaginator();