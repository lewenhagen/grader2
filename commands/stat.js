import { Command } from 'commander'
import { countSubmissions } from '../src/submissions.js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const TOKEN = process.env.CANVAS_TOKEN
const BASE_URL = process.env.BASE_URL
const COURSE_ID = process.env.COURSE_ID

const stat = new Command('stat')
  .description('Counts submissions for <section> <kmom>')
  .argument('(section) <string>', 'The section to get')
  .argument('(assignment) <string>', 'The assignment name')
  .option('-s, --silent', 'Only give result')
  .action(async (section, assignment, options) => {
    await countSubmissions(BASE_URL, COURSE_ID, TOKEN, section, assignment, options)
  })

export default stat
