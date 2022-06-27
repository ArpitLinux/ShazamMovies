// const express = require('express');
// const bodyParser = require('body-parser');

import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import axios from "axios"

import {SHAZAMOPTIONS, GOOGLEAPIKEY, GOOGLEAPICX} from "./keys.js"

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}))

app.use(express.static('public'))

app.post("/base64file", async (req, res, next) => {
    console.log(req.headers['content-length'])
    // SHAZAMOPTIONS.data = req.body.base64;

    // await axios.request(SHAZAMOPTIONS).then(async function (response) {
    //     var fullResponse = response.data
    //     console.log(fullResponse)
    //     var songName = response.data.track.share.subject
    //     const GOOGLEOPTIONS = {
    //         method: "GET",
    //         url: `https://customsearch.googleapis.com/customsearch/v1?q=${songName}&key=${GOOGLEAPIKEY}&cx=${GOOGLEAPICX}`,
    //     }
    //     await axios.request(GOOGLEOPTIONS).then(function(anotherResponse) {
    //         var obj = {"Song": songName, "Data": anotherResponse}
    //     })
    // }).catch(function (error) {
    //         console.error(error);
    //     });
    
})



const port = 3000;

app.listen(port, (error) => {
        console.log("Server is Successfully Running and App is listening on port "+ port)
});