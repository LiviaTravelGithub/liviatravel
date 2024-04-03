import dotenv from 'dotenv'
import pg from 'pg'
dotenv.config()
const { Pool } = pg

const pool = new Pool({
    user: process.env.PORT ? process.env.PG_USER : 'liviatour',
    password: process.env.PORT ? process.env.PG_PASSWORD : 'YQtvKYFdhhfpaw27GBFqB6Z5YMfCGjnv',
    database: process.env.PORT ? process.env.PG_DATABASE : 'offers_yy98',
    port: 5432,
    host: process.env.PORT ? process.env.PG_HOST : 'localhost',
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