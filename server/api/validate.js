export default defineEventHandler(async (event) => {
    const { token } = await readBody(event)

    console.log(token)

    if (!token) {
        throw createError({
            statusCode: 422,
            statusMessage: 'Token not found'
        })
    }

    return await verifyTurnstileToken(token)
})