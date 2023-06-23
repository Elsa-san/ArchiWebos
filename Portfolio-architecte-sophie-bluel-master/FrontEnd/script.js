
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {

        works.forEach(work => {
            const gallery = document.getElementsByClassName('gallery')[0]
            const figure = document.createElement('figure')
            const image = document.createElement('img')
            image.src = work.imageUrl;
            const figcaption = document.createElement('figcaption')
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
        const image = document.createElement('img')
        const figcaption = document.createElement('figcaption')
        image.src = work.imageUrl;
        figcaption.textContent = work.title
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
const workModal = document.getElementById('workModal');
const showModal = document.querySelectorAll('.show-modal')

const openModal = () => {
    modal.showModal()
}


showModal.forEach((button) => {
    button.addEventListener('click', openModal)
})

//to close the modal 

const closeModalCross = document.querySelector(".close-modal")
const closeModalOutside = document.querySelectorAll('.modal');
const closeModalCrossWorkModal = document.querySelector(".close-work-modal");
const backToModalButton = document.getElementById('backToModalButton')


closeModalCross.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target === workModal) {
        closeModal();
    }
});

workModal.addEventListener('click', (event) => {
    if (event.target === workModal) {
        closeModal();
    }
});

function closeModal() {
    modal.close();
    workModal.close();
}

closeModalCrossWorkModal.addEventListener('click', closeModal)


//back on left arrow
backToModalButton.addEventListener('click', function () {
    workModal.close()
})

//data recovery of the modal + icons to delete

fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {
        const galleryModal = document.querySelector('.gallery-modal')
        works.forEach(work => {
            const figure = document.createElement('figure')
            const image = document.createElement('img')
            image.src = work.imageUrl
            const figcaption = document.createElement('figcaption')
            figcaption.innerHTML = 'éditer'
            const deleteSpan = document.createElement('span');
            deleteSpan.classList.add('delete-icon');
            const deleteIcon = document.createElement('i')
            deleteIcon.classList.add('fa-solid', 'fa-trash-can')
            deleteSpan.appendChild(deleteIcon)
            figure.appendChild(image)
            figure.appendChild(figcaption)
            figure.appendChild(deleteSpan)
            galleryModal.appendChild(figure)
            deleteIcon.addEventListener('click', (event) => {
                event.preventDefault()
                deleteWork(work.id)
            })
        });
    });


//to delete a work in the modal 

function deleteWork(id) {
    const accessToken = localStorage.getItem('token')

    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`

        }
    })
        .then(response => {
            if (response.ok) {
                console.log('work deleted')
                removeWorkOnGallery(id) //to delete work on the gallery
            }
            else {
                console.error('deletion failed')
            }
        })
        .catch(error => {
            console.error('une erreur est survenue', error)
        })

}

function removeWorkOnGallery(workId) {
    const figure = document.querySelector(`.gallery figure[data-work-id="${workId}"]`)
    if (figure) {
        figure.remove()
    }
}


// Add a new work

const addWorkButton = document.getElementById('addWorkButton');
addWorkButton.addEventListener('click', openWorkModal);

function openWorkModal() {
    const modal = document.querySelector('.workModal');
    if (modal) {
        modal.showModal();
    }
}

// to fetch the categories by API

const categorySelectModal = document.getElementById('workCategory')

function fetchCategoriesModal() {
    const apiURL = 'http://localhost:5678/api/categories'

    fetch(apiURL)
        .then(response => response.json())
        .then(categoriesData => {
            addCategoriesToSelect(categoriesData)
        })
        .catch(error => {
            console.log('une erreur est survenue', error)
        })
}

// To add the categories to the dropdown list

function addCategoriesToSelect(categories) {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelectModal.appendChild(option);
    });
}

fetchCategoriesModal()

//preview of the image on the modal

const uploadButtonLabel = document.getElementById('uploadButtonLabel')
const photoPreview = document.getElementById('photo-preview')
let selectedImage = null

function triggerFileSelect() {
    const fileInput = document.getElementById('uploadButton')
    fileInput.type = 'file'
    fileInput.accept = 'image/jpeg, image/png'

    fileInput.addEventListener('change', (event) => {
        const photo = event.target.files[0]

        if (photo && photo.size > 4 * 1024 * 1024) {
            alert('la taille maximale est de 4 mo')
            return
        }

        if (photo) {
            selectedImage = photo
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                const previewImage = new Image()

                previewImage.onload = () => {
                    const maxHeight = 169 // Photo max height

                    console.log(previewImage.height)

                    //calcul to resize the image
                    const scaleFactor = maxHeight / previewImage.height;
                    const width = previewImage.width * scaleFactor;
                    const height = previewImage.height * scaleFactor;


                    //apply the new dimensions to the image
                    previewImage.width = width;
                    previewImage.height = height;

                    //erase preview content + add the new image
                    photoPreview.innerHTML = ''
                    photoPreview.appendChild(previewImage)
                }
                //define the src of image
                previewImage.src = reader.result
            })

            //read the image as data URL
            reader.readAsDataURL(photo)
            uploadButton.style.display = 'none';


            // Hide the other elements on modal
            const elementsHidden = document.querySelectorAll('.modal p, .modal i.fa-image');
            elementsHidden.forEach((element) => {
                element.style.display = 'none';
            });
            uploadButtonLabel.style.display = 'none';

        }
    });

    //triger the click on the button of file selection
    fileInput.click()
}

uploadButton.addEventListener('click', triggerFileSelect)

//conditions check to submit

document.addEventListener('DOMContentLoaded', function () {
    const photoInput = document.getElementById('uploadButton')
    const titleInput = document.getElementById('workTitle')
    const categoryInput = document.getElementById('workCategory')
    const submitButtonModal = document.getElementById('submitButtonModal')

    function checkFields() {
        const photoValue = photoInput.value.trim()
        const titleValue = titleInput.value.trim()
        const categoryValue = categoryInput.value.trim()

        if (photoValue !== '' && titleValue !== '' && categoryValue !== "") {
            submitButtonModal.classList.add('submit-button-active')
            submitButtonModal.removeAttribute('disabled') //submit button enable to click
        } else {
            submitButtonModal.classList.remove('submit-button-active')
            submitButtonModal.setAttribute('disabled', 'disabled') // submit button disabled
        }
    }

    photoInput.addEventListener('input', checkFields)
    titleInput.addEventListener('input', checkFields)
    categoryInput.addEventListener('change', checkFields)

})

// send the new work to the gallery 
const submitButtonModal = document.getElementById('submitButtonModal')

//send a new project to the back-end by the modal form
function createWork() {
    const titleInput = document.getElementById('workTitle')
    const categoryInput = document.getElementById('workCategory')

    const image = selectedImage //photo recovery
    const title = titleInput.value.trim() //title recovery
    const category = parseInt(categoryInput.value.trim())//category id recovery

    const formData = new FormData() // create a formdata to send data
    formData.append('image', image) //photo added to formdata
    formData.append('title', title) //title added to formdata
    formData.append('category', category) //category added to formdata

    const accessToken = localStorage.getItem('token')

    //send the request POST
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: formData
    })
        .then(response => response.json())
        .then(newWork => {
            console.log(newWork)
            addWorkToGallery(newWork) //add the new project to the gallery

        })
        .catch(error => {
            console.error('Une erreur est survenue', error)
        })

}

submitButtonModal.addEventListener('click', (event) => {
    event.preventDefault();
    createWork();
});


// answer of the API to show dynamically the new image on the gallery
function addWorkToGallery(work) {
    const gallery = document.getElementById('galleryContainer')
    const figure = document.createElement('figure')
    const image = document.createElement('img')
    const figcaption = document.createElement('figcaption')

    image.addEventListener('load', () => {
        figure.appendChild(image)
        figure.appendChild(figcaption)
        gallery.appendChild(figure)
    })

    image.src = work.imageUrl
    figcaption.textContent = work.title

    image.addEventListener('error', () => {
        console.error('loading image error')
    })


}
