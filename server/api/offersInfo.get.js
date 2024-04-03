import connection from '../modules/postgres.js'
export default defineEventHandler(async (event) => {
    const data = connection.query('SELECT * FROM lt_offers')
    return data
})