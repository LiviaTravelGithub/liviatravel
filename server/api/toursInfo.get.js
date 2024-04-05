import connection from "../modules/postgres";
export default defineEventHandler(async (event) => {
    try {
        const data = connection.query('SELECT * FROM lt_tours')
        return data
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
})