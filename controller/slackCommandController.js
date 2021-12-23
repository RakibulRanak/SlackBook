'use strict'
const slackVerificationToken = process.env.SLACK_VERIFICATION_TOKEN;
const axios = require('axios')
const Converter = require('timestamp-conv');
exports.serve = async (req, res, next) => {
    try {
        console.log(req.body)
        if (req.body.token === slackVerificationToken) {
            if (req.body.command === '/weather') {
                let weatherData = await axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=23.75280331031433&lon=90.37563165753778&exclude=hourly,daily,minutely&appid=d361ccad530aae28dce5d7a8e04b240d&units=metric')
                weatherData = weatherData.data.current;
                const currentDate = new Converter.date(weatherData.dt, { forceTimezone: true, timezone: 6 });
                const sunRiseDate = new Converter.date(weatherData.sunrise, { forceTimezone: true, timezone: 6 });
                const sunSetDate = new Converter.date(weatherData.sunset, { forceTimezone: true, timezone: 6 });
                const currentTime = `${currentDate.getHour()}:${currentDate.getMinute()}`
                const sunRise = `${sunRiseDate.getHour()}:${sunRiseDate.getMinute()}`
                const sunSet = `${sunSetDate.getHour()}:${sunSetDate.getMinute()}`
                const message = `Sunrise : ${sunRise}\nSunset : ${sunSet} \nTemperature : ${weatherData.temp}°C \nWind Speed : ${1.61 * weatherData.wind_speed}Km/h\nCondition : ${weatherData.weather[0].description}`

                // axios.post(req.body.response_url, {
                //     response_type: "in_channel",
                //     text: `Current weather report near CEFALO at ${currentTime}`,
                //     attachments: [
                //         {
                //             text: message
                //         }
                //     ]
                // })
                return res.status(200).send({
                    text: `Current weather report near CEFALO at ${currentTime}`,
                    attachments: [
                        {
                            text: message
                        }
                    ]
                })
            }
            else
                return res.status(200).send()
        }
        else
            return res.status(200).send()
    } catch (err) {
        console.log(err.data)
    }
}