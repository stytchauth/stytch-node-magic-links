const express = require("express");
const bodyParser = require("body-parser");
const url = require('url');
const stytch = require("stytch");
const session = require('express-session');

require('dotenv').config()

const app = express();
const port = process.env.PORT;
const path = `http://localhost:${port}`

// bodyParser allows us to access the body of the post request
app.use(bodyParser.urlencoded({ extended: true }));
// defines the directory where the static assets are so images & css render correctly
app.use(express.static('public'));
// set app to use ejs so we can use html templates
app.set('view engine', 'ejs')
// express-sessions for cookie storage
app.use(session({
    secret: 'some-secret-key',
    resave: false,
    saveUninitialized: true
}));

// define the stytch client using your stytch project id & secret
// use stytch.envs.live if you want to hit the live api
const client = new stytch.Client({
        project_id: process.env.STYTCH_PROJECT_ID,
        secret: process.env.STYTCH_SECRET,
        env: stytch.envs.test,
    }
);

// define the homepage route
// if valid session not present, shows login
app.get("/", async (req, res) => {

    const user = await getAuthenticatedUser(req)

    if (!user) {
        res.render('loginOrSignUp');
    } else {
        if (user.emails.length > 0) {
            res.render('loggedIn', {emailAddress: user.emails[0].email});
        }
        res.render('loggedIn', {emailAddress: user.crypto_wallets[0].crypto_wallet_address});
    }
    
});

// takes the email entered on the homepage and hits the stytch
// loginOrCreateUser endpoint to send the user a magic link
app.post('/login_or_create_user', function (req, res) {
    const params = {
        email: req.body.email,
        login_magic_link_url: 'http://localhost:3000/authenticate',
        signup_magic_link_url: 'http://localhost:3000/authenticate',
    };
    client.magicLinks.email.loginOrCreate(params)
        .then(
            // on success, render the emailSent page
            res.render('emailSent')
        )
        .catch(err => {
            // on failure, log the error then render the homepage
            console.log(err)
            res.render('loginOrSignUp')
        });
})

// This is the endpoint the link in the magic link hits. It takes the token from the
// link's query params and hits the stytch authenticate endpoint to verify the token is valid
app.get('/authenticate', async (req, res) => {
    const queryObject = url.parse(req.url,true).query;

    const resp = await client.magicLinks.authenticate({
        session_duration_minutes: 60,
        token: queryObject.token,
    })
    if (resp.status_code !== 200) {
        console.error('Authentication error')
        res.status(500).send();
        return;
    }
    req.session.sessionToken = resp.session_token
    res.redirect('/')
})

// handles the logout endpoint
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.render('loggedOut');
})

// run the server
app.listen(port, () => {
    console.log(`Listening to requests on ${path}`);
});

// helper for getting the session authenticated user
async function getAuthenticatedUser(req) {
    const sessionToken = req.session.sessionToken;
    if (!sessionToken) {
        return;
    }
    const resp = await client.sessions.authenticate({session_token: sessionToken});
    if (resp.status_code !== 200) {
        console.log('Session not authenticated')
        req.session.destroy();
        return;
    }
    req.session.sessionToken = resp.session_token
    return resp.user
}

app.post("/crypto_wallets/authenticate/start", function (req, res) {
    client.cryptoWallets.authenticateStart({
        crypto_wallet_address: req.body.address,
        crypto_wallet_type: "ethereum",
        siwe_params: {
            domain: 'localhost:3000',
            uri: 'http://localhost:3000',
            statement: 'I accept the terms of service.',
            chain_id: 10,
            message_request_id: 'request-123',
            resources: ['https://resource1.com', 'https://resource2.com/claims.json']
        }
    }).then(function (response) {
        return res.status(200).send(response)
    })
});

app.post("/crypto_wallets/authenticate", async (req, res) => {
    const resp = await client.cryptoWallets.authenticate({
        crypto_wallet_address: req.body.address,
        crypto_wallet_type: "ethereum",
        signature: req.body.signature,
        session_duration_minutes: 60,
    })
    if (resp.status_code !== 200) {
        console.error('Authentication error')
        res.status(500).send();
        return;
    }
    req.session.sessionToken = resp.session_token
    return res.status(200).send(resp)
});