const request = require('request')
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs') 
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//Used Object Attributes:
//  Title
//  Name
//  Message
//  Error
//  Forecast
//  Location
const renderData = {
    title: 'Weather',
    name: 'Weylin Morris',
    message: 'Some helpful text.'
}

app.get('', (req, res) => {
    res.render('index', renderData)
})

app.get('/about', (req, res) => {
    res.render('about', renderData)
})

app.get('/help', (req, res) => {
    res.render('help', renderData)
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

//  Key Value in URL
//  url.com/stuff?key=value&key=value
app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error: 'You must provide a search term!'
        })
    } else {
        res.send({
            products: []
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        error: 'Help Article Not Found',
        name: 'Weylin Morris',
        title: '404'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        error: 'Page Not Found',
        name: 'Weylin Morris',
        title: '404'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
}) 