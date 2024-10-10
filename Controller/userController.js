import { validateUser } from '../schemas/userSchema.js'
import { userModel } from '../Model/userModel.js'
import bcryptjs from 'bcryptjs'
export class userController {
  static create = async (req, res) => {
    // validating the information user given us
    const userInf = await validateUser(req.body)

    // return an error if the information is not valid
    if (userInf.error) {
      res.status(400).json({ message: 'Invalid information' })
      return false
    }

    if (await userModel.verifyUser({ username: userInf.data.username })) {
      const hashedPassword = await bcryptjs.hash(userInf.data.password, 10)
      await userModel.insertUser({ username: userInf.data.username, password: hashedPassword })
      res.status(200).json({ message: 'The user was created' })
    } else {
      res.status(400).json({ message: 'The username is no availed' })
    }
  }

  static logout = async (req, res) => {
    res.clearCookie('accessToken').render('index')
  }

  // login
  static login = async (req, res) => {
    // validating the information given for the user
    const userInf = await validateUser(req.body)
    if (userInf.error) {
      res.status(400).json({ message: userInf.error.message })
    }
    const checkedUser = await userModel.logUser({ username: userInf.data.username, password: userInf.data.password })

    if (checkedUser) {
      return res.status(200).cookie('accessToken', checkedUser.accessToken, { httpOnly: true }).cookie('refreshToken', checkedUser.refreshToken).json(checkedUser.data)
    } else {
      return res.status(400).json({ message: 'invalid data' })
    }
  }

  static protectedPage = async (req, res) => {
    const { user } = req.session

    console.log(user)

    if (user) {
      return res.render('protected', user)
    } else {
      return res.status(400).send('<h1>Something went wrong</h1>')
    }
  }
}
