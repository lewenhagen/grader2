import { Command } from 'commander'
import { printJSON } from '../src/functions.js'

const json = new Command('json')
  .description('Prints the raw JSON object')
  .action(() => {
    printJSON()
  })

export default json