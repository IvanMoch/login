import express from 'express'
import { config } from './config.js'
import { userController } from './Controller/userController.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/public')))

// middleware for cookies

// accessToken
app.use((req, res, next) => {
  const accessToken = req.cookies.accessToken
  req.session = { user: null }

  try {
    const data = jwt.verify(accessToken, config.SECRET_WORD)
    req.session.user = data
  } catch (error) {
    // eslint-disable-next-line eqeqeq
    if (error.name == 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
        req.session.user = null
      }
      const data = jwt.verify(refreshToken, config.SECRET_WORD)

      const newAccessToken = jwt.sign(data, config.SECRET_WORD)
      req.session.user = data
      res.cookie('accessToken', newAccessToken, { httpOnly: true })
    }
  }

  next()
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  const { user } = req.session

  if (user) {
    return res.render('protected', user)
  } else {
    return res.render('index')
  }
})

app.post('/login', userController.login)

app.post('/logout', userController.logout)

app.post('/create', userController.create)

app.get('/protected', userController.protectedPage)

app.listen(config.PORT, () => {
  console.log(`app listening in http://localhost:${config.PORT}`)
})
