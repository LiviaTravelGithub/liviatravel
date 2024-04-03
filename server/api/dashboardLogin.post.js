import dotenv from 'dotenv'
import validator from 'validator'
import bcrypt from 'bcrypt'
import connection from '../modules/postgres.js'
import jwt_util from '../modules/jwt.js'
dotenv.config()
export default defineEventHandler(async (event) => {
    const { username, password } = await readBody(event)
    const sanitizedUsername = validator.escape(username)
    const query = `SELECT * FROM lt_users WHERE username = $1`
    const data = await connection.query(query, [sanitizedUsername])
    const user = data.rows[0]
    if (!user) {
        return {
            success: false,
            message: 'User not found'
        }
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        return {
            success: false,
            message: 'Incorrect password'
        }
    }

    const tokenPayload = {
        id: user.id,
        username: user.username
    }

    const secretKey = Buffer.from(process.env.SECRET_KEY256, 'hex')
    const token = await jwt_util.createEncryptedJWT("user_login", tokenPayload, secretKey)

    return {
        success: true,
        token
    }
    
})