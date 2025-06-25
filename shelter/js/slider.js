// main page slider

const buttonPrev = document.querySelector('.slider-button-prev');
const buttonNext = document.querySelector('.slider-button-next');
const slider = document.querySelector('.slider-list');
const sliderWrapper = slider.parentElement;
const sliderItemClass = 'slider-item';
const sliderItemNameAttribute = 'data-id';
const prevAnimationClass = 'switch-to-previous';
const nextAnimationClass = 'switch-to-next';
const showPopupClassButton = 'show-popup';

let animalsData;
let unusedAnimalIndexes;
let currentSliderState = [];
let previousSliderState = [];
let slidesNumber;
let previosDirection;
let itemsForPaste;
let direction = 'next';
let windowSize = () => document.documentElement.clientWidth;

//get json data
const getJsonData = () => {
    return fetch('../../js/slider-data.json')
    .then(response => {
        if (!response.ok) {
            console.log('No slider data has been received');
        }
        return response.json();
    });
};


// slide count
let getSlidesNumber = () => {
    let count;
    let width = windowSize();

    if (width > 1200) {
        count = 3;
    } else if ((768 <= width) && (width <= 1200)) {
        count = 2;
    } else {
        count = 1;
    }

    return slidesNumber = count;
};


// adding html slide elements
const addSlideOnPage = (currentSliderState) => {
    // item properties
    // sliderArray[index].name
    // sliderArray[index].img
    // sliderArray[index].type
    // sliderArray[index].breed
    // sliderArray[index].description
    // sliderArray[index].age
    // sliderArray[index].inoculations
    // sliderArray[index].diseases
    // sliderArray[index].parasites

    for (let i = 0; i < currentSliderState.length; i++) {
        let index = currentSliderState[i];

        let listItem = document.createElement("li");

        listItem.classList.add('catalog-item');
        listItem.classList.add(sliderItemClass);
        listItem.setAttribute(sliderItemNameAttribute, index);
        if (direction === 'next') {
            slider.appendChild(listItem);
        } else {
            slider.prepend(listItem);
        }

        listItem.innerHTML =`<img class="catalog-item-img"
                        src="${animalsData[index].img}"
                        alt="${animalsData[index].name}">
                            <span class="catalog-item-name">${animalsData[index].name}</span>
                            <div class="catalog-item-button">
                                <div class="button light ${showPopupClassButton}">
                                    <span class="button-text">Learn more</span>
                                </div>
                            </div>`;
    };
};

// create slide list without duplicates
const chooseSliderItems = () => {
    let randomNumber;
    let slideIndexByRandomNumber;
    
    previousSliderState = currentSliderState;
    currentSliderState = [];

    while (currentSliderState.length < slidesNumber) {
        randomNumber = Math.floor(Math.random() * unusedAnimalIndexes.length);
        slideIndexByRandomNumber = unusedAnimalIndexes[randomNumber];

        if (!currentSliderState.includes(slideIndexByRandomNumber)) {
            currentSliderState.push(slideIndexByRandomNumber);
            unusedAnimalIndexes = unusedAnimalIndexes.toSpliced(randomNumber, 1);
        }
    };

    if (previousSliderState.length > 0) {
        unusedAnimalIndexes = unusedAnimalIndexes.concat(previousSliderState);
    }

//    return [currentSliderState, unusedAnimalIndexes];
   return currentSliderState;
};


const copySliderItems = () => {
    let allSliderItems = slider.children;
    let htmlForPaste = '';
    let itemStartIndex;
    let itemLastIndex;

    if (direction === 'prev') {
        itemStartIndex = 0;
        itemLastIndex = slidesNumber;
    } else {
        itemStartIndex = slider.children.length - slidesNumber;
        itemLastIndex = slider.children.length;
    }

    for (i = itemStartIndex; i < itemLastIndex; i++) {
        htmlForPaste = htmlForPaste + allSliderItems[i].outerHTML;
    }

    return htmlForPaste;
};

const removeSliderItems = (set) => {

    switch (set) {
        case 'removePrevSet':
            for (i = 0; i < slidesNumber; i++) {
                slider.firstChild.remove();
            }
            break;

        case 'removeNextSet':
            for (i = 0; i < slidesNumber; i++) {
                slider.lastChild.remove();
            }
            break;
            
        case 'removeActiveSet':
            for (i = 0; i < slidesNumber; i++) {
                slider.children[slidesNumber].remove();
            }
            break;                       
    }
};

const addAnimationClass = () => {
    switch (direction) {
        case 'prev':
            slider.classList.add(prevAnimationClass);
            break;

        case 'next':           
            slider.classList.add(nextAnimationClass);
            break;
    };
    buttonPrev.classList.add('disabled');
    buttonNext.classList.add('disabled');
};

const removeAnimationClass = () => {
    if (slider.classList.contains(prevAnimationClass)) {
        slider.classList.remove(prevAnimationClass);
    } else {
        slider.classList.remove(nextAnimationClass);
    }
    buttonPrev.classList.remove('disabled');
    buttonNext.classList.remove('disabled');
};


// slide function
const moving = (updatedDirection) => {
    direction = updatedDirection;

    // if direction was changed
    if (!previosDirection || previosDirection === direction) {
        // deleting repeated slides items
        if (direction === 'prev') {
            removeSliderItems('removePrevSet');
        } else {
            removeSliderItems('removeNextSet');
        }

        // create new items to show 
        chooseSliderItems();

        // add new slider items
        addSlideOnPage(currentSliderState);
    } else {
        unusedAnimalIndexes = unusedAnimalIndexes.toSpliced(-slidesNumber, slidesNumber);
        unusedAnimalIndexes = unusedAnimalIndexes.concat(currentSliderState);

        [currentSliderState, previousSliderState] = [previousSliderState, currentSliderState];
    }

    // copy items
    itemsForPaste = copySliderItems();

    // add animation class and move by css
    addAnimationClass();

    

    previosDirection = direction;
};

// wait animation end
slider.addEventListener('animationend', () => {

    // remove animation class
    removeAnimationClass();

    // remove unnecessary slider items
    if (direction === 'prev') {
        removeSliderItems('removeNextSet');
    } else {
        removeSliderItems('removePrevSet');
    }

    // adding copied slider items
    slider.children[slidesNumber - 1].insertAdjacentHTML('afterEnd', itemsForPaste);
});


// buttons events
buttonPrev.addEventListener('click', () => moving('prev'));
buttonNext.addEventListener('click', () => moving('next'));


const updateSlider = () => {
    slider.innerHTML = '';
    unusedAnimalIndexes = Object.keys(animalsData);
    previousSliderState = [];
    currentSliderState = [];
    previosDirection = '';
    direction = 'next';

    chooseSliderItems();

    for (i = 0; i < 3; i++) {
        addSlideOnPage(currentSliderState);
    }
};

// const resizeSliderWrapper = new ResizeObserver(() => {
//     slidesNumber = getNumberSlides();
//     updateSlider();
// });
// resizeSliderWrapper.observe(sliderWrapper);

// if window size was changed
window.addEventListener('resize', () => {
    let oldCountSlides = slidesNumber;

    slidesNumber = getSlidesNumber();
    if (oldCountSlides !== slidesNumber) {
        updateSlider();
    }
});

// get animals data
// (async function(){
//     animalsData = await getJsonData();
//     unusedAnimalIndexes = Object.keys(animalsData);
// })();

// slider loading
const initSlider = async () => {
    // get animals data
    animalsData = await getJsonData();
    unusedAnimalIndexes = Object.keys(animalsData);

    // get visible slides number
    slidesNumber = getSlidesNumber();

    chooseSliderItems();

    for (i = 0; i < 3; i++) {
        addSlideOnPage(currentSliderState);
    }

    // click to show popup
    slider.onclick = function(event) {
        let sliderItem = event.target.closest('.' + sliderItemClass);
        let indexItemInAnimalsData;

        if (!sliderItem) return;

        indexItemInAnimalsData = sliderItem.getAttribute(sliderItemNameAttribute);
        showPopup(animalsData[indexItemInAnimalsData]);
    };
};

initSlider();