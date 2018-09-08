const express = require('express');
const morgan = require ('morgan');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
var cache = {};

app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/', function(req, res) {
    var movieTitle = req.query.t;
    var movieId = req.query.i;
    if(movieId !== undefined) {
        if(cache.MovieId === movieId){
            res.status(200).json(cache.data);
            console.log('movieId sent from cache');

        } else {
            console.log('movie not found in cache, using axios');
            axios
            .get('http://www.omdbapi.com/?i=' + movieId + '&apikey=8730e0e')
            .then(response => {
                res.status(200).json(response.data);
                cache = {'MovieId' : movieId, 'data':response.data};
            }) 
            .catch(error => {
                console.log(error);
            });
        }
    } else   { 
        if(cache.MovieTitle === movieTitle) {
            res.status(200).json(cache.data);
            console.log('MovieTitle sent from cache');
        }else {
            console.log('movie not found in cache, using axios');
            axios
            .get('http://www.omdbapi.com/?t=' + encodeURIComponent(movieTitle) + '&apikey=8730e0e')
            .then(response => {
                res.status(200).json(response.data);
                cache = {'MovieTitle': movieTitle, 'data': response.data};
            })
            .catch(error => {
                console.log(error);
            });
        }
    }
});


// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter
//handle response variable

module.exports = app;