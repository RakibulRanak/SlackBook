'use strict'
const axios = require('axios')
const fs = require('fs')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)
const Converter = require('timestamp-conv');
const slackVerificationToken = process.env.SLACK_VERIFICATION_TOKEN || 'NOT_UNDEFINED'
const administrator_1 = process.env.ADMINISTRATOR_SLACK_MEMBER_ID_1;
const administrator_2 = process.env.ADMINISTRATOR_SLACK_MEMBER_ID_2;

exports.serve = async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    // console.log(ip)
    try {
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

                return res.status(200).send({
                    text: `Current weather report near CEFALO at ${currentTime}`,
                    attachments: [
                        {
                            text: message
                        }
                    ]
                })
            }
            else if (req.body.command === '/setConfig') {
                if (req.body.user_name === administrator_1 || req.body.user_name === administrator_2) {
                    const content = req.body.text
                    await writeFileAsync('./.env', content)
                    res.status(200).send({
                        text: `Successfully configured environment!`,
                        attachments: [
                            {
                                text: content
                            }
                        ]
                    })
                    console.log('Successfully configured environment! Server is restarting!')
                    process.exit(1)
                }
                else {
                    res.status(200).send({
                        text: `You don't have permission to change config file`,
                    })
                    console.log('You do not have permission to change config file')
                }
            }
            else if (req.body.command === '/getConfig') {
                if (req.body.user_id === administrator_1 || req.body.user_id === administrator_2) {
                    const content = await readFileAsync('./.env', 'utf8')
                    res.status(200).send({
                        text: `Current environment setup!`,
                        attachments: [
                            {
                                text: content
                            }
                        ]
                    })
                    console.log('Successfully configuration file is sent to the administrator!')
                }
                else {
                    res.status(200).send({
                        text: `You don't have permission to read config file`,
                    })
                    console.log('You do not have permission to read config file')
                }
            }
            else return res.status(200).send()
        }
    }
    catch (err) {
        console.log(err.message)
    }
}