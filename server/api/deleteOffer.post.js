import connection from '../modules/postgres.js'
export default defineEventHandler(async (event) => {
    try {
        const id = await readBody(event)
        console.log(id)
        const query = `DELETE FROM lt_offers WHERE id = $1`
        await connection.query(query, [id])
    } catch (error) {
        console.log(error)
    }
})