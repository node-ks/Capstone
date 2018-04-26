const CreateUser = document.querySelector('.CreateUser')

CreateUser.addEventListener('submit', (e) => {
    e.preventDefault()
    const username = CreateUser.querySelector('.username').value 
    const password = CreateUser.querySelector ('.password').value 
    post('/createUser', {username, password})
})

const Login = document.querySelector('.Login')

Login.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = Login.querySelector('.username').value
  const password = Login.querySelector('.password').value
  post('/login', { username, password })
    .then((response) => {
        console.log("response", response)
      if (response.status === 200) {
          //window.location.assign('/home')
          //alert('Login success!')
          //window.location.assign('/home')
        }
      else alert('Login failed ( ͡° ͜ʖ ͡°)')
    })
})

function post (path, data) {
    return window.fetch(path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}