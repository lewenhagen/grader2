import { Command } from 'commander'
import { fetchData } from '../src/functions.js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const TOKEN = process.env.CANVAS_TOKEN
const BASE_URL = process.env.BASE_URL
const COURSE_ID = process.env.COURSE_ID

const fetch = new Command('fetch')
  .description('Fetches new data from Canvas')
  .option('-s, --silent', 'Fetches silently')
  .action(async (options) => {
    await fetchData(BASE_URL, COURSE_ID, TOKEN, options.silent)
  })

export default fetch