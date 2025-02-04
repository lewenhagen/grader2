#!/usr/env node

import { cleanExit, fetchData, printJSON, magic } from './src/magic.js'
import 'dotenv/config'

const TOKEN = process.env.CANVAS_TOKEN
const BASE_URL = process.env.BASE_URL
const COURSE_ID = process.env.COURSE_ID
const args = process.argv.slice(2)
const command = args.length === 0 ? cleanExit(1, 'No arguments present') : args[0]
const extra = args.length === 2 ? args[1] : null

async function main () {
  switch (command) {
    case 'fetch':
      await fetchData(BASE_URL, COURSE_ID, TOKEN)
      break
    case 'json':
      printJSON()
      break
    case 'magic':
      await magic(extra)
      break
    default:
      cleanExit(1, 'Wrong argument provided.')
      break
  }
}

await main()
