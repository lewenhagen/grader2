import { Command } from 'commander'
import { getCount } from '../src/functions.js'

const count = new Command('count')
  .description('Counts the gradings and prints date for grader')
  .argument('<string>', 'Substring (name) to search for')
  .action(async (str) => {
    await getCount(str)
  })

export default count