import { Command } from 'commander'
import { printResult } from '../src/functions.js'

const magic = new Command('magic')
  .description('Prints the magic table')
  .option('-t, --time', 'Prints the latest timestamp')
  .action(async (options) => {
    await printResult(options)
  })

export default magic