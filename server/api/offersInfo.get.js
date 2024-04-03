import connection from '../modules/postgres.js'
export default defineEventHandler(async (event) => {
    try {
        const data = connection.query('SELECT * FROM lt_offers')
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        return
    }
})