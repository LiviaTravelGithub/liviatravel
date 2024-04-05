import connection from '../modules/postgres.js'
export default defineEventHandler(async (event) => {
    try {
        const data = await connection.query('SELECT * FROM lt_offers')
        return data
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
})