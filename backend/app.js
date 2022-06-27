// const express = require('express');
// const bodyParser = require('body-parser');

import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import axios from "axios"

// TODO: ADD ERROR USECASES

import {SHAZAMOPTIONS, GOOGLEAPIKEY, GOOGLEAPICX} from "./keys.js"

const app = express();
app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json({limit: "20mb"}));
app.use(bodyParser.urlencoded({limit: "20mb", extended: true}))


app.post("/base64file", async (req, res, next) => {
    SHAZAMOPTIONS.data = req.body.base64;

    await axios.request(SHAZAMOPTIONS).then(async function (response) {
        var fullResponse = response.data
        if (response.data.track) {
            var songName = response.data.track.share.subject
            const GOOGLEOPTIONS = {
                method: "GET",
                url: `https://customsearch.googleapis.com/customsearch/v1?q=${songName}&key=${GOOGLEAPIKEY}&cx=${GOOGLEAPICX}`,
            }
            await axios.request(GOOGLEOPTIONS).then(function(anotherResponse) {
                console.log(anotherResponse)
                if (anotherResponse.data.items) {
                    var obj = {"Song": songName, "Data": anotherResponse.data}
                } else {
                    var obj = {"Song": songName, "Data": anotherResponse.data, "Err": "Information not found"}
                }
                res.json(obj)
            })
        } else {
            var obj = {"Err": "Sound not found"}
            res.json(obj)
        }
    }).catch(function (error) {
            console.error(error);
        });
    
})



const port = 8000;

app.listen(port, (error) => {
        console.log("Server is Successfully Running and App is listening on port "+ port)
});