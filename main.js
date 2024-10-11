#!/usr/env node

import { cleanExit, fetchData, printJSON, menu } from './src/helpers.js'
import { calculate } from './src/magic.js'

const TOKEN = process.env["CANVAS_TOKEN"]
const BASE_URL="https://bth.instructure.com"
const COURSE_ID = "5905"
const args = process.argv.slice(2)
const command = args.length === 0 ? cleanExit(1, "No arguments present") : args[0]

async function main() {
  switch (command) {
    case "fetch":
      await fetchData(BASE_URL, COURSE_ID, TOKEN)
      break
    case "print":
      printJSON()
      break
    case "calculate": 
      await calculate()
      break
    default:
      cleanExit(1, "Wrong argument provided.")
      break
  }
}

await main()
