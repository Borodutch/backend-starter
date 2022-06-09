# Backend starter code

This repository is to be used as a starter for Koa based Node.js applications written in TypeScript and using MongoDB. It includes a range of nice packages and configurations. It also has a stub for user login via Telegram, Facebook and Google. Enjoy!

## Installation and local launch

1. Clone this repo: `git clone https://github.com/Borodutch/backend-starter`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` with the environment variables listed below
4. Run `yarn` in the root folder
5. Run `yarn start`

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                                     | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| `MONGO`                                  | URL of the mongo database                |
| `JWT`                                    | secret for JWT                           |
| `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` | Facebook login credentials               |
| `TELEGRAM_LOGIN_TOKEN`                   | Telegram login bot                       |
| `PORT`                                   | Port to run server on (defaults to 1337) |

Also, please, consider looking at `.env.sample`.
