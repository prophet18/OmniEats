const express = require('express')
const { connectDB, models } = require('./database');

const app = express()
const port = 3000

connectDB();

app.use(express.json());

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
})

async function parseCSVAndAddEntry(address, name) {
    const fs = require('fs');
    const Papa = require('papaparse');

    const doordash_csv = fs.readFileSync('client/doordash.csv', 'utf8');
    const doordash_results = Papa.parse(doordash_csv, {header: true})['data'];

    const grubhub_csv = fs.readFileSync('client/grubhub.csv', 'utf8');
    const grubhub_results = Papa.parse(grubhub_csv, {header: true})['data'];

    const ubereats_csv = fs.readFileSync('client/Ubereat_US_Merchant.csv', 'utf-8');
    const ubereats_results = Papa.parse(ubereats_csv, {header: true})['data'];

    const address_array_dd = [];
    const address_array_gh = [];
    const address_array_ue = [];
    const regex_a = new RegExp('\\b' + address + '\\b', 'gi');

    const results_dd = [];
    const results_gh = [];
    const results_ue = [];

    doordash_results.forEach(object => {
        if(object['address'] !== undefined) {
            const matches = object['address'].match(regex_a);

            if(matches !== null) {
                address_array_dd.push(object)
            }
        }
    });

    if(address_array_dd.length === 1) {
        results_dd.push(address_array_dd[0])
    }

    grubhub_results.forEach(object => {
        if(object['address'] !== undefined) {
            const matches = object['address'].match(regex_a);

            if(matches !== null) {
                address_array_gh.push(object)
            }
        }
    });

    if(address_array_gh.length === 1) {
        results_gh.push(address_array_gh[0])
    }

    ubereats_results.forEach(object => {
        if(object['address'] !== undefined) {
            const matches = object['address'].match(regex_a);

            if(matches !== null) {
                address_array_ue.push(object)
            }
        }
    });

    if(address_array_ue.length === 1) {
        results_ue.push(address_array_ue[0])
    }

    const regex = new RegExp('\\b' + name + '\\b', 'gi');
    address_array_dd.forEach(object => {
        const matches = object['loc_name'].match(regex);
        
        if(matches !== null) {
            results_dd.push(object);
        }
    });

    address_array_gh.forEach(object => {
        const matches = object['loc_name'].match(regex);
        
        if(matches !== null) {
            results_gh.push(object);
        }
    });

    address_array_ue.forEach(object => {
        const matches = object['loc_name'].match(regex);
        
        if(matches !== null) {
            results_ue.push(object);
        }
    });

        console.log(results_dd);
        console.log(results_gh);
        console.log(results_ue);

        let dd = results_dd[0]['review_rating']
        let gh = results_gh[0]['review_rating']
        let ue = results_ue[0]['review_rating']


        const newEntry = await models.Business.create({
            name: name,
            address: address,
            dd_rating: dd,
            gh_rating: gh,
            ue_rating: ue
        });

        return newEntry;
    }

// Get business entry
app.get('/business/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const businessEntry = await models.Business.findOne({ address: address });
        if (businessEntry) {
            res.json(businessEntry);
        } else {
            const newEntry = await parseCSVAndAddEntry(address);
            
            if (newEntry) {
                res.json(newEntry);
            } else {
                res.status(404).json({ error: 'Business entry not found and could not be added' });
            }
        }
    } catch (error) {
        console.error('Error fetching business entries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});