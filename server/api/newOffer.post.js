import connection from '../modules/postgres.js'
export default defineEventHandler(async (event) => {
    try {
        const data = await readBody(event)
        const query = `INSERT INTO lt_offers (title, country, description, price, location, details, img, rating, duration, is_special, type, date_created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`

        const values = [
            data.title,
            data.country,
            data.description,
            data.price,
            data.location,
            data.details,
            data.img,
            data.rating,
            data.duration,
            data.is_special,
            data.type,
            new Date()
        ]
        // await connection.query(query, values)
    } catch (error) {
        console.log(error)
    }
})