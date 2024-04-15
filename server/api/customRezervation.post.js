import nodemailer from 'nodemailer'
import axios from 'axios'
export default defineEventHandler(async (event) => {
    const data = await readBody(event)
    const BASE_URL = 'https://api.textbee.dev/api/v1'
    const API_KEY = '32e27458-6778-4932-b7e2-7ebf11cfea30'
    const DEVICE_ID = '661613e06db45ae354384639'
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "7bf0579336798f",
            pass: "2bb0fac6d51104"
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
            from: 'backend@example.com',
            to: 'stanislav.alexandru@gmail.com',
            subject: 'Rezervare noua',
            html: mailHTML
        })
        console.log(response)
    } catch (error) {
        console.log(error)
    }
    try {
        const response = await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/sendSMS?apiKey=${API_KEY}`, {
            receivers: ['+40773773816'],
            smsBody: `Solicitare oferta de la ${data.first_name} ${data.last_name}, <${data.email}>. Va rugam verificati mailul pentru mai mult detalii.`,
        })
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
})