import { Command } from 'commander'
import { getInfo } from '../src/info.js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const TOKEN = process.env.CANVAS_TOKEN
const BASE_URL = process.env.BASE_URL
const COURSE_ID = process.env.COURSE_ID

const info = new Command('info')
  .description('Get enrolled acronyms')
  .argument('<string>', 'mail or acro')
  .option('--save', 'Saves the output to file')
  .action(async (str, options) => {
    await getInfo(BASE_URL, COURSE_ID, TOKEN, str, options.save)
  })

export default info
