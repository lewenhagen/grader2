#!/usr/env node

import { Command } from 'commander'
import fetch from './commands/fetch.js'
import magic from './commands/magic.js'
import json from './commands/json.js'
import count from './commands/count.js'
import stat from './commands/stat.js'
import info from './commands/info.js'

const program = new Command()

program
  .name('main.js')
  .usage('<command> <option>')
  .description('CLI to followup grading in courses')
  .version('2.0.0')

program.addCommand(fetch)
program.addCommand(magic)
program.addCommand(json)
program.addCommand(count)
program.addCommand(stat)
program.addCommand(info)

program.parse(process.argv)
