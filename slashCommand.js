const slackVerificationToken = process.env.SLACK_VERIFICATION_TOKEN;

exports.serve = async (req, res, next) => {
    try {
        console.log(req.body)
        if (req.body.token === slackVerificationToken && req.body.command === '/zork') {

            axios.post(req.body.response_url, {
                response_type: "in_channel",
                text: "aaa",
            })
            return res.status(200).send()

        }
    } catch (err) {
        console.log(err)
    }
}