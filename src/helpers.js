#!/usr/env node

import fs from "fs"

function menu() {
  console.log(`
    This is the Grader script, this time in JS!
    -------------------------------------------
    Command        Description
    -------------------------------------------
    fetch          Fetches new data from Canvas
    print          Prints the gradebook in JSON
    calculate      Calculate the scores 
    `)
}
function cleanExit(exitCode = 0, msg) {
  console.info(`Message: ${msg}`)
  menu()
  process.exit(exitCode)
}

async function fetchData(BASE_URL, COURSE_ID, TOKEN) {
  let counter = 1
  let result = []
  let done = true

  while (done) {
    let GRADEBOOK_URL=`${BASE_URL}/api/v1/courses/${COURSE_ID}/gradebook_history/feed?page=${counter}&per_page=100`  
    let gradebookPage = await((await fetch(GRADEBOOK_URL, {headers: {"Authorization": `Bearer ${TOKEN}`}})).json())
    
    if (gradebookPage.length === 0) {
        console.info(`Complete`)
        done = false
    } else {
      result.push(...gradebookPage)
      console.info(`Fetched: ${result.length} grades`)
    }
    counter++
  }
  fs.writeFileSync("./gradebook.json", JSON.stringify(result))
}

function printJSON() {
  const jsonString = fs.readFileSync("./gradebook.json", "utf8")
  const json = JSON.parse(jsonString)
  console.log(json)
}



export {
  cleanExit,
  fetchData,
  printJSON,
  menu
}

