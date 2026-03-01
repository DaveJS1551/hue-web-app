const express = require('express');
const db = require('./db')
const https = require("https")
const http = require("http");
const { json } = require('stream/consumers');
const { deflate } = require('zlib');
const { hostname } = require('os');
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(express.json());
const PORT = 2308;

const HUE_BRIDGE_IP = process.env.HUE_BRIDGE_IP;
const HUE_USERNAME = process.env.HUE_USERNAME;

/*
app.use(cors({
    origin: true,
    credentials: true
}));
*/


app.get('/', (req, res) => {
  res.send('Hue backend is running! 🚀');
});

app.get('/api/test', (req, res) => {
  res.send('Test Worked!');
});

app.get('/api/hue-config', (req, res) => {
    res.json({
        bridgeIp: HUE_BRIDGE_IP,
        username: HUE_USERNAME ? "Loaded (Hidden for security)" : "MISSING!",
        configLoaded: !!HUE_BRIDGE_IP && !!HUE_USERNAME
    })
});
app.get('/api/db-test', (req, res) => {
    try {
        const presets = db.prepare("INSERT OR IGNORE INTO presets (name, description, data) VALUES (?, ?, ?) ");
        presets.run("Test Presest", 'Created from API test', JSON.stringify({test: true}));

        res.json({
            message: "Database is working ",
            presets: presets
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

app.get('/api/lights', (req, res) => {
    if (!HUE_BRIDGE_IP || !HUE_USERNAME) {
        return res.status(500).json({error: "Hue bridge config is missing from .env"});
    }

    const url = `/api/${HUE_USERNAME}/lights`
    
    http.get(`http://${HUE_BRIDGE_IP}${url}`, (hueRes) => {
        let data = '';

        hueRes.on('data', (chunk) => {
            data += chunk
        });

        hueRes.on('end', () => {
            
            try {
                const lights = JSON.parse(data);

                if (lights[0] && lights[0].error) {
                    return res.status(401).json({error: 'Hue API error', details: lights[0].error})
                }

                const lightArray = Object.entries(lights).map(([id, light]) => ({
                    id,
                    ...light
                }));

                res.json({
                    success: true,
                    count: lightArray.length,
                    lights: lightArray
                });
            } catch (error) {
                res.status(500).json({error: "Failed to parse response", details: error.message});
            }
        });
    })


})

app.get('/api/presets', (req, res) => {
    try {
        const getPresets = db.prepare("SELECT * FROM presets").all()
        //getPresets.run()

        const presetsWithParsedData = getPresets.map(preset => ({
            ...preset,
            data: JSON.parse(preset.data)
        }));

        res.json({
            message: "Got presets",
            presets: presetsWithParsedData
        });
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    
})

app.put('/api/lights/:id/state', (req, res) => {
    const { id } = req.params;
    const state = req.body;


    //validate a change was included. 
    if (!state || Object.keys(state).length == 0) {
        return res.status(400).json({
            success:false,
            error: "No state changes included in body. eg; {hue: 1000, on: true}"
        })
    }

    if (!HUE_USERNAME || !HUE_BRIDGE_IP) {
        return res.status(500).json({
            success: false,
            error: "Hue Bridge configuration is missing. (.env error)"
        })
    }

    const path = `/api/${HUE_USERNAME}/lights/${id}/state`;
    const data = JSON.stringify(state)

    const options = {
        hostname: HUE_BRIDGE_IP,
        port: 80,
        path: path,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    }

    const http = require("http");

    const hueRequest = http.request(options, (hueRes) => {
        let responseBody = '';
    

        hueRes.on('data', (chunk) => {
            responseBody += chunk;
        });

        hueRes.on('end', () => {
            try {
                const result = JSON.parse(responseBody);

                const hasError = result.some(item => item.error);

                if (hasError) {
                    return res.status(400).json({
                        success: false,
                        hueResponse: result,
                        message: "Hue Bridge rejected certain changes"
                    });
                }

                res.json({
                    success: true,
                    message: "Light state changed",
                    lightId: id,
                    changesApplied: result
                });


            } catch (err) {
                res.status(500).json( {
                    success: false,
                    error: 'Failed to parse hue response',
                    rawResponse: responseBody
                });
            } // end catch
        });

    });

    hueRequest.on('error', (err) => {
        res.status(500).json({
            success: false,
            error: "Failed to connect to hue bridge",
            details: err.message
        })
    })

    hueRequest.write(data);
    hueRequest.end();
})

app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});