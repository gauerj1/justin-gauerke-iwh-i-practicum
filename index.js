require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
//JPG Updates
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });
    } catch (error) {
        console.error('Error fetching contacts:', error.message);
        res.status(500).send('Error fetching contacts.');
    }
});

app.get('/drinks', async (req, res) => {
    const drinks = 'https://api.hubspot.com/crm/v3/objects/drinks?properties=drink_name,garnish,base_spirit';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    try {
        const resp = await axios.get(drinks, { headers });

       //console.log("Full response from HubSpot API:", resp.data);

        const data = resp.data.results;

        //console.log("Data to be rendered:", data);

        res.render('drinks', { title: 'Drinks | HubSpot APIs', data });
    } catch (error) {
        console.error('Error fetching drinks:', error.message);
        res.status(500).send('Error fetching drinks.');
    }
});

app.get('/', async (req, res) => {
    const drinks = 'https://api.hubspot.com/crm/v3/objects/drinks?properties=drink_name,garnish,base_spirit';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    try {
        const resp = await axios.get(drinks, { headers });

        const data = resp.data.results;

        res.render('homepage', { title: 'Drinks | HubSpot APIs', data });
    } catch (error) {
        console.error('Error fetching drinks:', error.message);
        res.status(500).send('Error fetching drinks.');
    }
});

app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    const { drink_name, base_spirit, garnish } = req.body;

    // Ensure base_spirit and garnish are arrays, even if only one option is selected
    const newDrink = {
        properties: {
            drink_name,
            base_spirit: Array.isArray(base_spirit) ? base_spirit.join(', ') : base_spirit,
            garnish: Array.isArray(garnish) ? garnish.join(', ') : garnish,
        },
    };

    const addUrl = 'https://api.hubspot.com/crm/v3/objects/drinks';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    try {
        // Send the POST request to add the new drink
        await axios.post(addUrl, newDrink, { headers });

        // Redirect to the homepage or drinks list after adding
        res.redirect('/');
    } catch (error) {
        console.error('Error adding new drink:', error.response?.data || error.message);
        res.status(500).send('Error adding new drink.');
    }
});


//JPG End


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));