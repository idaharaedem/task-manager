const sgMail  = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'lonenlyjass@gmail.com',
        subject: 'Thans for joining',
        text: `Welcome to the appppp ${name}`
    })
}

const cancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'lonenlyjass@gmail.com',
        subject: 'Sorry to see you leaving',
        text: `Sorry to see you leaving ${name}. Let us know if theres anything we can do to change your mind`
    })
}

module.exports = {
    sendWelcomeEmail,
    cancelEmail: cancelEmail
}