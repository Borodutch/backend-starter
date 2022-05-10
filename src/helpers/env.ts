import * as dotenv from 'dotenv'
import { cleanEnv, num, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  PORT: num({ default: 1337 }),
  FACEBOOK_APP_ID: str({default: '123'}),
  FACEBOOK_APP_SECRET: str({default: '123'}),
  JWT: str({default: '123'}),
  MONGO: str({default: 'mongodb+srv://test123:test123@cluster0.ejcrc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'}),
  TELEGRAM_LOGIN_TOKEN: str({default: '123'}),
});
