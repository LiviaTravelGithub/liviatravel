import connection from '../modules/postgres.js'
export default defineEventHandler(async (event) => {
    console.log('offersInfo.get', event)
    const data = connection.query('SELECT * FROM lt_offers')
    return data
})