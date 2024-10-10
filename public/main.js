/* eslint-disable no-undef */
const logInButton = document.querySelector('#LogInContainer')
const signUpButton = document.querySelector('#signUpContainer')

logInButton.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = document.querySelector('#username').value
  const password = document.querySelector('#password').value

  login(username, password)
})

signUpButton.addEventListener('submit', (e) => {
  e.preventDefault()

  const username = document.querySelector('#Newusername').value
  const password = document.querySelector('#NewPassword').value
  const confPassword = document.querySelector('#ConfPassword').value

  if (password === confPassword) {
    fetch('/create', {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })

    })
      .then((res) => {
        if (res.ok) {
          login(username, password)
        } else {
          alert('something were wrong')
        }
      })
  } else {
    alert('both password should being equals')
  }
})

function login (username, password) {
  fetch('/login', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })

  })
    .then((res) => {
      if (res.ok) {
        alert(`Welcome ${username}, you have logged in`)
        setTimeout(() => {
          window.location.href = '/protected'
        }, 2000)
      } else {
        alert('Something were wrong')
      }
    })
}
