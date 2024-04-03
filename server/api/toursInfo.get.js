import connection from "../modules/postgres";
export default defineEventHandler(async (event) => {
    const data = connection.query('SELECT * FROM lt_tours')
    return data
})