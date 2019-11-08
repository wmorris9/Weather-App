const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/14c7348519d39a2eabc703b484fe8467/' + latitude + ',' + longitude

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) { 
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + Math.floor(body.currently.temperature) + ' degress out. There is a ' + body.currently.precipProbability * 100 + '% chance of rain.')
        }
    })
}

module.exports = forecast