const request = require('request');
const argv = require('yargs').argv
const fs = require('fs');

const geocodingKey = 'AIzaSyBWT1XRcwa9QqxKI90bZBUnLcxwDtwJ_Ms';
const darkSkyKey = '4cd0b2586d83d2497df00848b8996ff4';

const geocodingUrl =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" + argv.city + "&key=" + geocodingKey;

request.get(geocodingUrl, (error, response, body) => {
    let geocodingJson = JSON.parse(body);
    if (geocodingJson.status !== 'ZERO_RESULTS') {
        let lat = geocodingJson.results[0].geometry.location.lat;
        let lng = geocodingJson.results[0].geometry.location.lng;
        let darkSkyUrl = "https://api.darksky.net/forecast/" + darkSkyKey + "/" + lat + "," + lng;
        request.get(darkSkyUrl, (error, response, body) => {
            let darkSkyJson = JSON.parse(body);
            console.log(
                `temperature: ${darkSkyJson.currently.temperature} -`,
                `icon: ${darkSkyJson.currently.icon} -`,
                `humidity: ${darkSkyJson.currently.humidity}`,
                `wind speed: ${darkSkyJson.currently.windSpeed}`
            );
                let weather = `Now ${darkSkyJson.currently.icon} with temperature: ${darkSkyJson.currently.temperature}, humidity: ${darkSkyJson.currently.humidity} , and wind speed: ${darkSkyJson.currently.windSpeed} .`;
            fs.writeFile("./weather.txt", weather, function(err) {
                if (err) {
                    return console.log(err);
                }
            });

        });
    }
    else {
        console.log("Sorry, such a city does not exist")
    }
});
