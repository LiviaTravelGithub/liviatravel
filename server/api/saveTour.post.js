import connection from "../modules/postgres";
export default defineEventHandler(async (event) => {
    try {
        const data = await readBody(event)
        const { id, title, price, country, location, duration, available, rating, departure, arrival, type, description, img } = data
        const query = "UPDATE lt_tours SET title = $1, price = $2, country = $3, location = $4, duration = $5, available = $6, rating = $7, departure = $8, arrival = $9, type = $10, description = $11, img = $12 WHERE id = $13"
        const values = [title, price, country, location, duration, available, rating, departure, arrival, type, description, img, id]

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