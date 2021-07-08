# stytch-node-magic-links

This example app uses the [Stytch API](https://stytch.com/docs/api) to send and authenticate magic links.

## Running the app

1. Fill in `STYTCH_PROJECT_ID` and `STYTCH_SECRET` in the `.env` file. Get your credentials from
   your [Stytch dashboard](https://stytch.com/dashboard/api-keys).
2. Add `http://localhost:4567/authenticate` (the `PORT` set in `.env`) as a valid sign-up and login URL on your [Stytch dashboard](https://stytch.com/dashboard/magic-link-urls).
3. Run `npm start`
4. Visit `http://localhost:4567` and login with your email. Then check for the Stytch email and click the sign in button. You should be signed in!
