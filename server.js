const express = require("express");
const bodyParser = require("body-parser");
const url = require('url');
const stytch = require("stytch")

require('dotenv').config()

const app = express();
const port = process.env.PORT;
const path = `http://localhost:${port}`
const magicLinkUrl = `${path}/authenticate`

// bodyParser allows us to access the body of the post request
app.use(bodyParser.urlencoded({ extended: true }));
// defines the directory where the static assets are so images & css render correctly
app.use(express.static('public'));
// set app to use ejs so we can use html templates
app.set('view engine', 'ejs')

// define the stytch client using your stytch project id & secret
// use stytch.envs.live if you want to hit the live api
const client = new stytch.Client({
        project_id: process.env.STYTCH_PROJECT_ID,
        secret: process.env.STYTCH_SECRET,
        env: stytch.envs.test,
    }
);

// define the homepage route
app.get("/", (req, res) => {
    res.render('loginOrSignUp');
});

// takes the email entered on the homepage and hits the stytch
// loginOrCreateUser endpoint to send the user a magic link
app.post('/login_or_create_user', function (req, res) {
    const params = {
        email: req.body.email,
        login_magic_link_url: magicLinkUrl,
        signup_magic_link_url: magicLinkUrl,
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
app.get('/authenticate', function (req, res) {
    const queryObject = url.parse(req.url,true).query;
    const authenticateParams = {
        token: queryObject.token
    }
    client.magicLinks.authenticate(authenticateParams)
        .then(resp => {
            // on success render the logged in view
            console.log('Response', resp)
            res.render('loggedIn')
        })
        .catch(err => {
            // on failure, log the error then render the homepage
            console.log(err)
            res.render('loginOrSignUp')
        });
})

// handles the logout endpoint
app.get('/logout', function (req, res) {
    res.render('loggedOut');
})

// run the server
app.listen(port, () => {
    console.log(`Listening to requests on ${path}`);
});
