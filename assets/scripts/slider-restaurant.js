/** SLIDER: Restaurant */
'use strict'

const slideWrapperRestaurant = document.querySelector('[data-slide="wrapper-restaurant"]')
const slideListRestaurant = document.querySelector('[data-slide="list-restaurant"]')
const restaurantNavPreviousButton = document.querySelector('[data-slide="restaurant-nav-previous-button"]')
const restaurantNavNextButton = document.querySelector('[data-slide="restaurant-nav-next-button"]')
const restaurantSlideControlsWrapper = document.querySelector('[data-slide="restaurant-controls-wrapper"]')
let restaurantSlideItems = document.querySelectorAll('[data-slide="restaurant-item"]')
let controlButtonsRestaurant
let slideIntervalRestaurant

const state = {
    startPoint: 0,
    savedPosition: 0,
    currentPoint: 0,
    movement: 0,
    currentSlideIndex: 0,
    autoPlay: true,
    timeInterval: 0
}

function translateSlide({position}){
    state.savedPosition = position
    slideListRestaurant.style.transform = `translateX(${position}px)`
}
function getPosition({index}){
    const slideItem = restaurantSlideItems[index]
    const slideWidth = slideItem.clientWidth
    const position = - (index * slideWidth)
    return position
}
function setVisibleSlide({index, animate}){
    if(index === 0 || index === restaurantSlideItems.length - 1){
        index = state.currentSlideIndex
    }
    const position = getPosition({index: index})
    state.currentSlideIndex = index
    slideListRestaurant.style.transition = animate === true ? 'transform .5s' : 'none'
    activeControlButton({index: index})
    translateSlide({position: position})
}
function nextSlide(){
    setVisibleSlide({index: state.currentSlideIndex + 1, animate: true})
}
function previousSlide(){
    setVisibleSlide({index: state.currentSlideIndex - 1, animate: true})
}

function createControlButtons(){
    restaurantSlideItems.forEach(function(){
        const controlButton = document.createElement('button')
        controlButton.classList.add('restaurant-slide-control-button')
        controlButton.setAttribute('data-slide', 'control-button')
        restaurantSlideControlsWrapper.append(controlButton)
    })
}
function activeControlButton({index}) {
    const slideItem = restaurantSlideItems[index]
    const dataIndex = Number(slideItem.dataset.index)
    const controlButton = controlButtonsRestaurant[dataIndex]
    controlButtonsRestaurant.forEach(function(controlButtonItem){
        controlButtonItem.classList.remove('active')
    })
    if(controlButton) {
        controlButton.classList.add('active')
    }
}

function createSlideClones() {
    const firstSlide = restaurantSlideItems[0].cloneNode(true)
    firstSlide.classList.add('slide-cloned')
    firstSlide.dataset.index = restaurantSlideItems.length

    const secondSlide = restaurantSlideItems[1].cloneNode(true)
    secondSlide.classList.add('slide-cloned')
    secondSlide.dataset.index = restaurantSlideItems.length + 1

    const lastSlide = restaurantSlideItems[restaurantSlideItems.length - 1].cloneNode(true)
    lastSlide.classList.add('slide-cloned')
    lastSlide.dataset.index = -1

    const penultimateSlide = restaurantSlideItems[restaurantSlideItems.length - 2 ].cloneNode(true)
    penultimateSlide.classList.add('slide-cloned')
    penultimateSlide.dataset.index = -2

    slideListRestaurant.append(firstSlide)
    slideListRestaurant.append(secondSlide)
    slideListRestaurant.prepend(lastSlide)
    slideListRestaurant.prepend(penultimateSlide)

    restaurantSlideItems = document.querySelectorAll('[data-slide="restaurant-item"]')
}

function onMouseDown(event, index) {
    const slideItem = event.currentTarget
    state.startPoint = event.clientX
    state.currentPoint = event.clientX - state.savedPosition
    state.currentSlideIndex = index
    slideListRestaurant.style.transition = 'none'
    slideItem.addEventListener('mousemove', onMouseMove)
}
function onMouseMove(event) {
    state.movement = event.clientX - state.startPoint
    const position = event.clientX - state.currentPoint
    translateSlide({ position: position })
    state.savedPosition = position
}
function onMouseUp(event) {
    const pointToMove = event.type.includes('touch') ? 50 : 150
    const slideItem = event.currentTarget
    if (state.movement < -pointToMove) {
        nextSlide()
    } else if (state.movement > pointToMove) {
        previousSlide()
    } else {
        setVisibleSlide({index: state.currentSlideIndex, animate: true})
    }
    slideItem.removeEventListener('mousemove', onMouseMove)
}

function onTouchStart(event, index){
    event.clientX = event.touches[0].clientX
    onMouseDown(event, index)
    const slideItem = event.currentTarget
    slideItem.addEventListener('touchmove', onTouchMove)
}
function onTouchMove(event){
    event.clientX = event.touches[0].clientX
    onMouseMove(event)
}
function onTouchEnd(event){
    onMouseUp(event)
    const slideItem = event.currentTarget
    slideItem.removeEventListener('touchmove', onTouchMove)
}

function onControlButtonClick(index) {
    setVisibleSlide({index: index + 2, animate: true})
}

function onSlideListTransitionEnd() {
    if(state.currentSlideIndex === restaurantSlideItems.length - 2){
        setVisibleSlide({index: 2, animate: 'none'})
    }
    if(state.currentSlideIndex === 1 ){
        setVisibleSlide({index: restaurantSlideItems.length - 3, animate: 'none'})
    }
}
function setAutoPlay() {
    if (state.autoPlay) {
        slideIntervalRestaurant = setInterval(function() {
            setVisibleSlide({index: state.currentSlideIndex + 1, animate: true})
        }, state.timeInterval)
    }
}

function setListeners(){
    controlButtonsRestaurant = document.querySelectorAll('[data-slide="control-button"]')
    
    /**
     * Ao clicar em um ControlButton chama a função onControlButtonClick.
     */
    controlButtonsRestaurant.forEach(function(controlButton, index) {
        controlButton.addEventListener('click', function(event) {
            onControlButtonClick(index)
        })
    })

    /**
     * Ao arrastar um slide, tanto com o Mouse quanto com o Touch, chama a função correspondente ao comando.
     */
    restaurantSlideItems.forEach(function(slideItem, index) {
        slideItem.addEventListener('dragstart', function(event) {
            event.preventDefault()
        })
        slideItem.addEventListener('mousedown', function(event){
            onTouchStart(event, index)
        })
        slideItem.addEventListener('mouseup', onMouseUp)

        slideItem.addEventListener('touchstart', function(event){
            onTouchStart(event, index)
        })
        slideItem.addEventListener('touchend', onTouchEnd)
    })

    /**
     * Ao clicar em um navButton chama a função correspondente ao botão (navNextButton/navPreviousButton).
     */
    restaurantNavNextButton.addEventListener('click', nextSlide)
    restaurantNavPreviousButton.addEventListener('click', previousSlide)

    /**
     * Responsável pelas transições.
     */
    slideListRestaurant.addEventListener('transitionend', onSlideListTransitionEnd)
    slideWrapperRestaurant.addEventListener('mouseenter', function() {
        clearInterval(slideIntervalRestaurant)
    })
    slideWrapperRestaurant.addEventListener('mouseleave', function(){ 
        setAutoPlay()
    })
}

function initSlider({startAtIndex = 0, autoPlay = true, timeInterval = 3000}){
    state.autoPlay = autoPlay
    state.timeInterval = timeInterval
    createControlButtons()
    createSlideClones()
    setListeners()
    setVisibleSlide({index: startAtIndex + 2, animate: true})
    setAutoPlay()
}

initSlider({
    autoPlay: false,
    startAtIndex: 0,
    timeInterval: 3000
})