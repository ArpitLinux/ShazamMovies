// const express = require('express');
// const bodyParser = require('body-parser');

import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import axios from "axios"

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
        var songName = response.data.track.share.subject
        const GOOGLEOPTIONS = {
            method: "GET",
            url: `https://customsearch.googleapis.com/customsearch/v1?q=${songName}&key=${GOOGLEAPIKEY}&cx=${GOOGLEAPICX}`,
        }
        await axios.request(GOOGLEOPTIONS).then(function(anotherResponse) {
            console.log(anotherResponse)
            var obj = {"Song": songName, "Data": anotherResponse.data}
            res.json(obj)
        })
    }).catch(function (error) {
            console.error(error);
        });
    
})



const port = 3000;

app.listen(port, (error) => {
        console.log("Server is Successfully Running and App is listening on port "+ port)
});