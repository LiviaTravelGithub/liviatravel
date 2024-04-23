import nodemailer from 'nodemailer'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
export default defineEventHandler(async (event) => {
    const data = await readBody(event)
    const BASE_URL = 'https://api.textbee.dev/api/v1'
    const API_KEY = process.env.TXT_API_KEY
    const DEVICE_ID = process.env.TXT_DEVICE
    const transporter = nodemailer.createTransport({
        host: process.env.MT_HOST,
        port: 2525,
        auth: {
            user: process.env.MT_USER,
            pass: process.env.MT_PASS
        }
    });

    const mailHTML = `<h3>Rezervare noua de la &lt;${data.rezervationInfo.email}&gt;</h3>
    <table style="font-family: Arial, Helvetica, sans-serif;">
        <tr>
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Nume</td>
            <td style="border-bottom: 1px dotted">${data.rezervationInfo.firstName}</td>
        </tr>
        <tr>
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Prenume</td>
            <td style="border-bottom: 1px dotted">${data.rezervationInfo.lastName}</td>
        </tr>
        <tr>
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Email</td>
            <td style="border-bottom: 1px dotted">${data.rezervationInfo.email}</td>
        </tr>
        <tr>
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Telefon</td>
            <td style="border-bottom: 1px dotted">${data.rezervationInfo.phone}</td>
        </tr>
        <tr>
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Adulti</td>
            <td style="border-bottom: 1px dotted">${data.rezervationInfo.adults}</td>
        </tr>
        <tr>
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Copii</td>
            <td style="border-bottom: 1px dotted">${data.rezervationInfo.children}</td>
        </tr>
        <tr>
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Pret</td>
            <td style="border-bottom: 1px dotted">${data.rezervationInfo.tourPrice}</td>
        </tr>
        <tr>
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Locatie</td>
            <td style="border-bottom: 1px dotted">${data.rezervationInfo.tourName}</td>
        </tr>
    </table>`

    try {
        const response = await transporter.sendMail({
            from: process.env.MT_DOMAIN,
            to: process.env.MT_RECIPIENT,
            subject: `Rezervare noua de la <${data.rezervationInfo.email}>`,
            html: mailHTML
        })
        console.log(response)
    } catch (error) {
        console.log(error)
    }

    try {
        const txtRecipients = process.env.TXT_NUMBERS.split(',')
        const response = await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/sendSMS?apiKey=${API_KEY}`, {
            receivers: txtRecipients,
            smsBody: `Rezervare noua pentru ${data.rezervationInfo.firstName} ${data.rezervationInfo.lastName}, <${data.rezervationInfo.email}>. Va rugam verificati mailul pentru mai mult detalii.`,
        })
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
})