import { createPool } from 'mysql2/promise'
import { DB_CONFIG, config } from '../config.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const pool = createPool(DB_CONFIG)

export class userModel {
  static async verifyUser ({ userName }) { // This returns true if the username does not exist
    const result = await pool.query('select * from users where name = ? ', [userName])

    // eslint-disable-next-line eqeqeq
    if (result[0].length == 0) {
      return true
    } else {
      return false
    }
  }

  static async insertUser ({ username, password }) {
    await pool.query('insert into users(name,password) values(?,?)', [username, password])
  }

  static async logUser ({ username, password }) {
    const user = await pool.query('select * from users where name = ?', [username])
    const accessToken = jwt.sign({ username, password }, config.SECRET_WORD, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ username, password }, config.SECRET_WORD, { expiresIn: '1y' })

    // eslint-disable-next-line eqeqeq
    if (user[0].length == 0) {
      return false
    }

    const checkedPassword = await bcrypt.compare(password, user[0][0].password)

    if (checkedPassword) {
      return {
        data: user[0][0],
        accessToken,
        refreshToken
      }
    } else {
      return false
    }
  }
}
