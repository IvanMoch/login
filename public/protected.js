const logoutButton = document.querySelector('#logout')

logoutButton.addEventListener('click', (e) => {
  e.preventDefault()
  fetch('/logout', { method: 'POST' })
    .then((res) => {
      if (res.ok) {
        window.location.href = '/'
      } else {
        // eslint-disable-next-line no-undef
        alert('something went wrong')
      }
    })
})
