const slackVerificationToken = process.env.SLACK_VERIFICATION_TOKEN;
const axios = require('axios')

const getWeatherData = async() => {
    try{
        return await  axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=23.75280331031433&lon=90.37563165753778&exclude=hourly,daily&appid=d361ccad530aae28dce5d7a8e04b240d')
    }catch(error){
        console.log(error);
    }
}

exports.serve = async (req, res, next) => {
    try {
        console.log(req.body)
        if (req.body.token === slackVerificationToken && req.body.command === '/zork') {
            const data = await getWeatherData();
            console.log(data)
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