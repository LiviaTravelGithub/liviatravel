import dotenv from 'dotenv'
import pg from 'pg'
dotenv.config()
const { Pool } = pg

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: 5432,
    host: process.env.PG_HOST,
    ssl: { rejectUnauthorized: false }
})

const connection = {
    pool,
    query: (...args) => {
        return pool.connect().then((client) => {
            return client
                .query(...args)
                .then((res) => {
                    client.release()
                    return res
                })
                .catch((err) => {
                    client.release()
                    throw err
                })
        })
    }
}

export default connection