const sgMail  = require('@sendgrid/mail')
const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'lonenlyjass@gmail.com',
        subject: 'Thans for joining',
        text: `Welcome to the app ${name}`
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