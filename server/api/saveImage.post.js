import fs from 'fs'
import path from 'path'
export default defineEventHandler(async (event) => {
    try {
        const file = await readMultipartFormData(event)
        file.forEach((file) => {
            console.log(file)
            const filePath = path.join(process.cwd(), 'public', 'img', file.filename)
            fs.writeFile(filePath, file.data, () => {
                console.log('Image saved')
            })
        })
    } catch (error) {
        console.log(error)
    }
})