fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {

        works.forEach(work => {
            const gallery = document.getElementsByClassName('gallery')[0]
            const figure = document.createElement('figure')
            const image = document.createElement('img');
            image.src = work.imageUrl;
            const figcaption = document.createElement('figcaption');
            gallery.appendChild(figure)
            figure.appendChild(image)
            figure.appendChild(figcaption)
        });

    });

function updateGallery(works) {
    const gallery = document.getElementsByClassName('gallery')[0]
    gallery.innerHTML = ""   // remove the gallery content
    works.forEach(work => {
        const figure = document.createElement('figure')
        const image = document.createElement('img');
        image.src = work.imageUrl;
        const figcaption = document.createElement('figcaption');
        gallery.appendChild(figure)
        figure.appendChild(image)
        figure.appendChild(figcaption)
    });
}

const filtersAll = document.getElementById('filters-all')
const filtersObjects = document.getElementById('filters-objects')
const filtersAppartments = document.getElementById('filters-appartments')
const filtersHotels = document.getElementById('filters-hotels')
let allWorks = []
let categories = []

function fetchCategories() {
    return fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(categoriesData => {
            return categoriesData;
        })
}

function fetchWorks() {
    const apiURL = 'http://localhost:5678/api/works';
    fetch(apiURL)
        .then(response => response.json())
        .then(works => {
            allWorks = works;
            updateGallery(allWorks);
        });

}

function filterAllClick() {
    updateGallery(allWorks)
}

function filterObjectsClick() {
    const filtered = allWorks.filter(work => work.categoryId === categories.find(category => category.name === 'Objets').id)
    updateGallery(filtered)

}

function filterAppartmentsClick() {
    const filtered = allWorks.filter(work => work.categoryId === categories.find(category => category.name === 'Appartements').id)
    updateGallery(filtered)

}

function filterHotelsClick() {
    const filtered = allWorks.filter(work => work.categoryId === categories.find(category => category.name === 'Hotels & restaurants').id)
    updateGallery(filtered)

}

fetchCategories('http://localhost:5678/api/categories')
    .then(categoriesData => {
        categories = categoriesData;
        fetchWorks();
    });

filtersAll.addEventListener('click', filterAllClick)
filtersObjects.addEventListener('click', filterObjectsClick)
filtersAppartments.addEventListener('click', filterAppartmentsClick)
filtersHotels.addEventListener('click', filterHotelsClick)

fetchWorks()

const loginText = document.getElementById('login-text')

const userAuthenticated = typeof localStorage.getItem('token') === 'string'

if (userAuthenticated) {
    loginText.innerText = "logout"
    const hiddenElements = document.querySelectorAll('.hidden')
    hiddenElements.forEach(element => {
        element.classList.remove('hidden');
    });

}

const modal = document.getElementById('modal')
const showModal = document.querySelectorAll('.show-modal')
const openModal = () => {
    modal.showModal()
}

showModal.forEach((button) => {
    button.addEventListener('click', openModal);
})

const closeModalCross = document.querySelector(".close-modal")

//to close the modal
const closeModal = () => {
    modal.close()
}
//close outside of the modal
closeModalCross.addEventListener('click', closeModal)
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal()
    }
})





