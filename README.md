# stytch-node-magic-links

This example app uses the [Stytch API](https://stytch.com/docs/api) to send and authenticate magic links.

## Running the app

1. Fill in `STYTCH_PROJECT_ID` and `STYTCH_SECRET` in the `.env` file. Get your credentials from
   your [Stytch dashboard](https://stytch.com/dashboard/api-keys).
2. Add `http://localhost:3000/authenticate` (the `PORT` set in `.env`) as a valid sign-up and
   login URL on your [Stytch dashboard](https://stytch.com/dashboard/redirect-urls).
3. Run `npm i`
4. Run `npm start`
5. Visit `http://localhost:3000` and login with your email. Then check for the Stytch email and
   click the sign in button. You should be signed in!

## Next steps

This example app showcases a small portion of what you can accomplish with Stytch. Here are a few ideas to explore:

1. Add additional login methods like [OAuth](https://stytch.com/docs/api/oauth-google-start) or [Passwords](https://stytch.com/docs/api/password-create).
2. Secure your app further by building MFA authentication using methods like [OTP](https://stytch.com/docs/api/send-otp-by-sms).

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our ​[Slack community](https://stytch.com/docs/resources/support/overview)!

#### :question: Need support?

Check out the [Stytch Forum](https://forum.stytch.com/) or email us at [support@stytch.com](mailto:support@stytch.com).
