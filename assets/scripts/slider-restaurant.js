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

const restaurantState = {
    startPoint: 0,
    savedPosition: 0,
    currentPoint: 0,
    movement: 0,
    currentSlideIndex: 0,
    autoPlay: true,
    timeInterval: 0
}

function restaurantTranslateSlide({positionRestaurant}){
    restaurantState.savedPosition = positionRestaurant
    slideListRestaurant.style.transform = `translateX(${positionRestaurant}px)`
}
function restaurantGetPosition({indexRestaurant}){
    const slideItemRestaurant = restaurantSlideItems[indexRestaurant]
    const slideWidthRestaurant = slideItemRestaurant.clientWidth
    const positionRestaurant = - (indexRestaurant * slideWidthRestaurant)
    return positionRestaurant
}
function restaurantSetVisibleSlide({indexRestaurant, animateRestaurant}){
    if(indexRestaurant === 0 || indexRestaurant === restaurantSlideItems.length - 1){
        indexRestaurant = restaurantState.currentSlideIndex
    }
    const positionRestaurant = restaurantGetPosition({indexRestaurant})
    restaurantState.currentSlideIndex = indexRestaurant
    slideListRestaurant.style.transition = animateRestaurant === true ? 'transform .5s' : 'none'
    restaurantActiveControlButton({indexRestaurant})
    restaurantTranslateSlide({positionRestaurant})
}
function restaurantNextSlide(){
    restaurantSetVisibleSlide({indexRestaurant: restaurantState.currentSlideIndex + 1, animateRestaurant: true})
}
function restaurantPreviousSlide(){
    restaurantSetVisibleSlide({indexRestaurant: restaurantState.currentSlideIndex - 1, animateRestaurant: true})
}

function restaurantCreateControlButtons(){
    restaurantSlideItems.forEach(function(){
        const controlButtonRestaurant = document.createElement('button')
        controlButtonRestaurant.classList.add('restaurant-slide-control-button')
        controlButtonRestaurant.setAttribute('data-slide', 'restaurant-control-button')
        restaurantSlideControlsWrapper.append(controlButtonRestaurant)
    })
}
function restaurantActiveControlButton({indexRestaurant}) {
    const slideItemRestaurant = restaurantSlideItems[indexRestaurant]
    const dataIndexRestaurant = Number(slideItemRestaurant.dataset.index)
    const controlButtonRestaurant = controlButtonsRestaurant[dataIndexRestaurant]
    controlButtonsRestaurant.forEach(function(controlButtonItem){
        controlButtonItem.classList.remove('active')
    })
    if(controlButtonRestaurant) {
        controlButtonRestaurant.classList.add('active')
    }
}

function restaurantCreateSlideClones() {
    const firstSlideRestaurant = restaurantSlideItems[0].cloneNode(true)
    firstSlideRestaurant.classList.add('restaurant-slide-cloned')
    firstSlideRestaurant.dataset.index = restaurantSlideItems.length

    const secondSlideRestaurant = restaurantSlideItems[1].cloneNode(true)
    secondSlideRestaurant.classList.add('restaurant-slide-cloned')
    secondSlideRestaurant.dataset.index = restaurantSlideItems.length + 1

    const lastSlideRestaurant = restaurantSlideItems[restaurantSlideItems.length - 1].cloneNode(true)
    lastSlideRestaurant.classList.add('restaurant-slide-cloned')
    lastSlideRestaurant.dataset.index = -1

    const penultimateSlideRestaurant = restaurantSlideItems[restaurantSlideItems.length - 2 ].cloneNode(true)
    penultimateSlideRestaurant.classList.add('restaurant-slide-cloned')
    penultimateSlideRestaurant.dataset.index = -2

    slideListRestaurant.append(firstSlideRestaurant)
    slideListRestaurant.append(secondSlideRestaurant)
    slideListRestaurant.prepend(lastSlideRestaurant)
    slideListRestaurant.prepend(penultimateSlideRestaurant)

    restaurantSlideItems = document.querySelectorAll('[data-slide="restaurant-item"]')
}

function onRestaurantMouseDown(event, indexRestaurant) {
    const slideItemRestaurant = event.currentTarget
    restaurantState.startPoint = event.clientX
    restaurantState.currentPoint = event.clientX - restaurantState.savedPosition
    restaurantState.currentSlideIndex = indexRestaurant
    slideListRestaurant.style.transition = 'none'
    slideItemRestaurant.addEventListener('mousemove', onRestaurantMouseMove)
}
function onRestaurantMouseMove(event) {
    restaurantState.movement = event.clientX - restaurantState.startPoint
    const positionRestaurant = event.clientX - restaurantState.currentPoint
    restaurantTranslateSlide({positionRestaurant})
    restaurantState.savedPosition = positionRestaurant
}
function onRestaurantMouseUp(event) {
    const pointToMoveRestaurant = event.type.includes('touch') ? 50 : 150
    const slideItemRestaurant = event.currentTarget
    if (restaurantState.movement < -pointToMoveRestaurant) {
        restaurantNextSlide()
    } else if (restaurantState.movement > pointToMoveRestaurant) {
        restaurantPreviousSlide()
    } else {
        restaurantSetVisibleSlide({indexRestaurant: restaurantState.currentSlideIndex, animateRestaurant: true})
    }
    slideItemRestaurant.removeEventListener('mousemove', onRestaurantMouseMove)
}

function onRestaurantTouchStart(event, indexRestaurant){
    event.clientX = event.touches[0].clientX
    onRestaurantMouseDown(event, indexRestaurant)
    const slideItemRestaurant = event.currentTarget
    slideItemRestaurant.addEventListener('touchmove', onRestaurantTouchMove)
}
function onRestaurantTouchMove(event){
    event.clientX = event.touches[0].clientX
    onRestaurantMouseMove(event)
}
function onRestaurantTouchEnd(event){
    onRestaurantMouseUp(event)
    const slideItemRestaurant = event.currentTarget
    slideItemRestaurant.removeEventListener('touchmove', onRestaurantTouchMove)
}

function onRestaurantControlButtonClick(indexRestaurant) {
    restaurantSetVisibleSlide({indexRestaurant: indexRestaurant + 2, animateRestaurant: true})
}

function onRestaurantSlideListTransitionEnd() {
    if(restaurantState.currentSlideIndex === restaurantSlideItems.length - 2){
        restaurantSetVisibleSlide({indexRestaurant: 2, animateRestaurant: 'none'})
    }
    if(restaurantState.currentSlideIndex === 1 ){
        restaurantSetVisibleSlide({indexRestaurant: restaurantSlideItems.length - 3, animateRestaurant: 'none'})
    }
}
function restaurantSetAutoPlay() {
    if (restaurantState.autoPlay) {
        slideIntervalRestaurant = setInterval(function() {
            restaurantSetVisibleSlide({indexRestaurant: restaurantState.currentSlideIndex + 1, animateRestaurant: true})
        }, restaurantState.timeInterval)
    }
}

function restaurantSetListeners(){
    controlButtonsRestaurant = document.querySelectorAll('[data-slide="restaurant-control-button"]')
    
    /**
     * Ao clicar em um ControlButton chama a função onControlButtonClick.
     */
    controlButtonsRestaurant.forEach(function(controlButton, indexRestaurant) {
        controlButton.addEventListener('click', function(event) {
            onRestaurantControlButtonClick(indexRestaurant)
        })
    })

    /**
     * Ao arrastar um slide, tanto com o Mouse quanto com o Touch, chama a função correspondente ao comando.
     */
    restaurantSlideItems.forEach(function(slideItemRestaurant, indexRestaurant) {
        slideItemRestaurant.addEventListener('dragstart', function(event) {
            event.preventDefault()
        })
        slideItemRestaurant.addEventListener('mousedown', function(event){
            onRestaurantTouchStart(event, indexRestaurant)
        })
        slideItemRestaurant.addEventListener('mouseup', onRestaurantMouseUp)

        slideItemRestaurant.addEventListener('touchstart', function(event){
            onRestaurantTouchStart(event, indexRestaurant)
        })
        slideItemRestaurant.addEventListener('touchend', onRestaurantTouchEnd)
    })

    /**
     * Ao clicar em um navButton chama a função correspondente ao botão (navNextButton/navPreviousButton).
     */
    restaurantNavNextButton.addEventListener('click', restaurantNextSlide)
    restaurantNavPreviousButton.addEventListener('click', restaurantPreviousSlide)

    /**
     * Responsável pelas transições.
     */
    slideListRestaurant.addEventListener('transitionend', onRestaurantSlideListTransitionEnd)
    slideWrapperRestaurant.addEventListener('mouseenter', function() {
        clearInterval(slideIntervalRestaurant)
    })
    slideWrapperRestaurant.addEventListener('mouseleave', function(){ 
        restaurantSetAutoPlay()
    })
}

function restaurantInitSlider({startAtIndex = 0, autoPlay = true, timeInterval = 3000}){
    restaurantState.autoPlay = autoPlay
    restaurantState.timeInterval = timeInterval
    restaurantCreateControlButtons()
    restaurantCreateSlideClones()
    restaurantSetListeners()
    restaurantSetVisibleSlide({indexRestaurant: startAtIndex + 2, animateRestaurant: true})
    restaurantSetAutoPlay()
}

restaurantInitSlider({
    autoPlay: false,
    startAtIndex: 0,
    timeInterval: 3000
})