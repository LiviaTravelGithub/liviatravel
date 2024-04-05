import connection from "../modules/postgres";
export default defineEventHandler(async (event) => {
    try {
        const data = await readBody(event)
        const { title, price, country, location, duration, available, rating, departure, arrival, type, description, img } = data
        const query = "INSERT INTO lt_tours (title, price, country, location, duration, available, rating, departure, arrival, type, description, img) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"
        const values = [title, price, country, location, duration, available, rating, departure, arrival, type, description, img]

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