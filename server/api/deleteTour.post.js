import connection from "../modules/postgres";
export default defineEventHandler(async (event) => {
    try {
        const id = await readBody(event)
        const query = `DELETE FROM lt_tours WHERE id = $1`
        await connection.query(query, [id])
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