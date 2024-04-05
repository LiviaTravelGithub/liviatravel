import connection from "../modules/postgres";
export default defineEventHandler(async (event) => {
    try {
        const data = await readBody(event)
        const { id, title, country, description, price, location, details, img, rating, duration, is_special, type } = data
        const query = `UPDATE lt_offers SET title = $1, country = $2, description = $3, price = $4, location = $5, details = $6, img = $7, rating = $8, duration = $9, is_special = $10, type = $11 WHERE id = $12`
        const values = [title, country, description, price, location, details, img, rating, duration, is_special, type, id]

        await connection.query(query, values)

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
})