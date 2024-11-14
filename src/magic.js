#!/usr/env node

import fs from 'fs'

let finalData = []
let assignments = []

async function generate() {
  let result = {}
  let total = {}
  total.Total = {}
  total["Genomströmning"] = {}
  total.Total["G"] = 0
  total.Total.Total = 0

  for (const item of finalData) {
    if (item.grade === null) continue

    total.Total.Total ++
    if (!(item.grader in result)) result[item.grader] = {}
    let kmom = item.kmom
    let grade = item.grade
    let grader = item.grader

    // For Teacher
    kmom in result[grader] ? result[grader][kmom]++ : result[grader][kmom] = 1
    grade in result[grader] ? result[grader][grade]++ : result[grader][grade] = 1
    "Total" in result[grader] ? result[grader].Total++ : result[grader].Total = 1

    // For Extra
    kmom in total.Total ? total.Total[kmom]++ : total.Total[kmom] = 1
    kmom in total["Genomströmning"] ? total["Genomströmning"][kmom] = Math.round((total.Total[kmom] / total.Total["Kmom01"])*100) + "%" : total["Genomströmning"][kmom] = 0
  }

  for (let item in result) {
      result[item]["%"] = Math.round((result[item].Total / total.Total.Total)*100) + "%"
      result[item]["%G"] = Math.round((result[item]["G"] / result[item].Total)*100) + "%"
      total.Total["G"] += result[item]["G"]
      total.Total["%G"] = Math.round((total.Total["G"] / total.Total.Total)*100) + "%"
  }

  total.Total["%"] = "100%"

  result["----------"] = {}
  result["Total"] = total.Total
  result["Genomströmning"] = total["Genomströmning"]

  // let output = []
  // for (const grader in result) {
  //   output.push(result[grader])
  // }
  // output.sort(function(a, b) {
  //   // console.log(a)
  //   return a["Total"] - b["Total"]
  // })
  // console.log(output)
  return result
}

async function parseData () {
  const jsonString = fs.readFileSync('./data/gradebook.json', 'utf8')
  const json = JSON.parse(jsonString)

  for (const grade in json) {
    if (!json[grade].grader.includes("Bedömd vid inlämning") && !json[grade].grader.includes("Umbridge") && !json[grade].assignment_name.includes("quiz") ) {
      finalData.push({
        "grader": json[grade].grader,
        "grade": json[grade].grade,
        "kmom": json[grade].assignment_name
      })
    }
  }

  assignments = [...new Set(finalData.map(item => item.kmom))]
}




function menu () {
  console.log(`
    This is the Grader script, this time in JS!
    -------------------------------------------
    Command        Description
    -------------------------------------------
    fetch          Fetches new data from Canvas
    print          Prints the gradebook in JSON
    magic          Parse the data and print table
    `)
}
function cleanExit (exitCode = 0, msg) {
  console.info(`Message: ${msg}`)
  menu()
  process.exit(exitCode)
}

async function fetchData (BASE_URL, COURSE_ID, TOKEN) {
  let counter = 1
  const result = []
  let done = false

  while (!done) {
    const GRADEBOOK_URL = `${BASE_URL}/api/v1/courses/${COURSE_ID}/gradebook_history/feed?page=${counter}&per_page=100`
    const gradebookPage = await ((await fetch(GRADEBOOK_URL, { headers: { Authorization: `Bearer ${TOKEN}` } })).json())

    if (gradebookPage.length === 0) {
      console.info('Complete')
      done = true
    } else {
      result.push(...gradebookPage)
      console.info(`Fetched: ${result.length} grades`)
    }
    counter++
  }
  fs.writeFileSync('./data/gradebook.json', JSON.stringify(result))
}

function printJSON () {
  const jsonString = fs.readFileSync('./data/gradebook.json', 'utf8')
  const json = JSON.parse(jsonString)
  console.log(json)
}

async function magic() {
  await parseData()
  let result = await generate()

  console.table(result, assignments.concat(["Total", "%", "G", "%G"]))
}

export {
  cleanExit,
  fetchData,
  printJSON,
  menu,
  parseData,
  magic
}
