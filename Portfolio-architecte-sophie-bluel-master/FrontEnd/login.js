const inputEmail = document.getElementById('email')
const inputPassword = document.getElementById('password')
const submitButton = document.getElementById('connexion')
const loginForm = document.getElementById('form')
const errorContainer = document.getElementById('error-container')

loginForm.addEventListener('submit', (event) => {
    event.preventDefault() // no page reload


    let data = {
        email: inputEmail.value,
        password: inputPassword.value,
    }

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error("Erreur dans l’identifiant ou le mot de passe")
            }
        })
        .then(response => {
            // token storage + redirection if response 200
            localStorage.setItem('token', response.token)
            location.href = 'index.html'
        })

        .catch(error => {
            errorContainer.textContent = "Erreur dans l’identifiant ou le mot de passe"
            errorContainer.style.color = "red"
            console.error('Erreur dans l’identifiant ou le mot de passe', error)
        })
})