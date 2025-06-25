const navList = document.getElementById('navList');
const burgerButton = document.getElementById('burgerButton');
const blackout = document.querySelector('.nav-blackout');
const body = document.body;
const activeClassElement = 'active';
const activeClassBody = 'no-scroll';
const popup = document.getElementById('popup');
const popupWrapper = popup.parentElement;
const closePopupButton = document.querySelector('.popup-close-button');
const sliderList = document.getElementById('sliderList');

// Burger menu
const toggleBurger = () => {
    burgerButton.classList.toggle(activeClassElement);
    navList.classList.toggle(activeClassElement);
    blackout.classList.toggle(activeClassElement);
    body.classList.toggle(activeClassBody);
};

const closeBurger = () => {    
    burgerButton.classList.remove(activeClassElement);
    navList.classList.remove(activeClassElement);
    blackout.classList.remove(activeClassElement);
    body.classList.remove(activeClassBody);
};

burgerButton.addEventListener('click', toggleBurger);


// Popup
const showPopup = (popupData) => {
    // update data popup
    popup.querySelector('.popup-img-wrapper').innerHTML = `<img class="popup-img" src="${popupData.img}" alt="${popupData.name}">`;
    popup.querySelector('.popup-name').innerHTML = popupData.name;
    popup.querySelector('.popup-type').innerHTML = popupData.type;
    popup.querySelector('.popup-breed').innerHTML = popupData.breed;
    popup.querySelector('.popup-description').innerHTML = popupData.description;
    popup.querySelector('.popup-age').innerHTML = `<div class="popup-prop-name">age:</div>${popupData.age}`;
    popup.querySelector('.popup-inoculations').innerHTML = `<div class="popup-prop-name">inoculations:</div>${popupData.inoculations}`;
    popup.querySelector('.popup-diseases').innerHTML = `<div class="popup-prop-name">diseases:</div>${popupData.diseases}`;
    popup.querySelector('.popup-parasites').innerHTML = `<div class="popup-prop-name">parasites:</div>${popupData.parasites}`;
    // show popup
    popup.classList.add(activeClassElement);
    popupWrapper.classList.add(activeClassElement);
    body.classList.add(activeClassBody);
};

const closePopup = () => {
    popup.classList.remove(activeClassElement);
    popupWrapper.classList.remove(activeClassElement);
    body.classList.remove(activeClassBody);
};

closePopupButton.addEventListener('click', closePopup);


// close events
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('blackout') || 
        event.target.classList.contains('nav-link')) {
        closeBurger(); 
        closePopup();
    }

    // if (event.target.closest('.nav-burger')) {
    //     closePopup();
    // }
});

window.addEventListener('resize', () => {
    closeBurger();
    closePopup();
});
