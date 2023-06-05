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



