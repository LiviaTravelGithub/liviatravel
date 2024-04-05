import connection from "../modules/postgres";
import bcrypt from 'bcrypt'
export default defineEventHandler(async (event) => {
    try {
        const data = await readBody(event)
        const { username, oldPassword, newPassword } = data
        const query = "SELECT * FROM lt_users WHERE username = $1"
        const values = [username]
        const user = await connection.query(query, values)
        if(!user){
            return {
                success: false
            }
        }else{
            const match = await bcrypt.compare(oldPassword, user.rows[0].password)
            if(!match){
                return {
                    success: false
                }
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            const updateQuery = "UPDATE lt_users SET password = $1 WHERE username = $2"
            const updateValues = [hashedPassword, username]
            await connection.query(updateQuery, updateValues)
            return {
                success: true
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
})