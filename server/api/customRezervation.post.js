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

    const mailHTML = `<h3>Rezervare noua de la &lt;${data.email}&gt;</h3>
    <table style="font-family: Arial, Helvetica, sans-serif;">
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Nume</td>
            <td style="border-bottom: 1px dotted">${data.first_name}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Prenume</td>
            <td style="border-bottom: 1px dotted">${data.last_name}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Email</td>
            <td style="border-bottom: 1px dotted">${data.email}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Telefon</td>
            <td style="border-bottom: 1px dotted">${data.phone}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Adulti</td>
            <td style="border-bottom: 1px dotted">${data.adults}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Copii</td>
            <td style="border-bottom: 1px dotted">${data.children}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Data plecare</td>
            <td style="border-bottom: 1px dotted">${data.start_date}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Transport</td>
            <td style="border-bottom: 1px dotted">${data.transport}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Data intoarcere</td>
            <td style="border-bottom: 1px dotted">${data.end_date}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Nopti</td>
            <td style="border-bottom: 1px dotted">${data.offerDuration}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Buget</td>
            <td style="border-bottom: 1px dotted">${data.budget} ${data.currency}</td>
        </tr>
        <tr style="height: 25px">
            <td style="width: 150px;font-weight: bold;border-bottom: 1px dotted">Alte informatii</td>
            <td style="border-bottom: 1px dotted">${data.comment}</td>
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
        const txtRecipients = process.env.TXT_RECIPIENT.split(',')
        const response = await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/sendSMS?apiKey=${API_KEY}`, {
            receivers: txtRecipients,
            smsBody: `Solicitare oferta de la ${data.first_name} ${data.last_name}, <${data.email}>. Va rugam verificati mailul pentru mai mult detalii.`,
        })
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
})