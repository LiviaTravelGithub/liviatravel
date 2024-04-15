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
            smsBody: `Rezervare noua pentru ${data.rezervationInfo.firstName} ${data.rezervationInfo.lastName}, <${data.rezervationInfo.email}>. Va rugam verificati mailul pentru mai mult detalii.`,
        })
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
})