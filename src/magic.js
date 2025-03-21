#!/usr/env node

import fs from 'fs'

const finalData = []
let assignments = []
const latestGrades = {}
let json = {}

async function generate() {
  const result = {}
  const total = {}
  total.Total = {}
  // total["Genomströmning"] = {}
  total.Total["G"] = 0
  total.Total.Total = 0

  for (const item of finalData) {
    if (item.grade === null) continue

    total.Total.Total ++
    if (!(item.grader in result)) result[item.grader] = {}
    const kmom = item.kmom
    const grade = item.grade
    const grader = item.grader

    // For Teacher
    kmom in result[grader] ? result[grader][kmom]++ : result[grader][kmom] = 1
    grade in result[grader] ? result[grader][grade]++ : result[grader][grade] = 1
    "Total" in result[grader] ? result[grader].Total++ : result[grader].Total = 1


    // For Extra
    kmom in total.Total ? total.Total[kmom]++ : total.Total[kmom] = 1
    // kmom in total["Genomströmning"] ? total["Genomströmning"][kmom] = Math.round((total.Total[kmom] / total.Total["Kmom01"])*100) + "%" : total["Genomströmning"][kmom] = 0
  }

  for (const item in result) {
      result[item]["%"] = Math.round((result[item].Total / total.Total.Total)*100) + "%"
      result[item]["%G"] = Math.round((result[item]["G"] / result[item].Total)*100) + "%"
      total.Total["G"] += result[item]["G"]
      total.Total["%G"] = Math.round((total.Total["G"] / total.Total.Total)*100) + "%"
      result[item]["Senast"] = latestGrades[item].toLocaleString("sv-SE")

  }

  total.Total["%"] = "100%"

  result["----------"] = {}
  result["Total"] = total.Total
  // result["Genomströmning"] = total["Genomströmning"]

  return result
}



async function parseData () {
  const jsonString = fs.readFileSync('./data/gradebook.json', 'utf8')
  json = JSON.parse(jsonString)

  for (const grade in json) {
    // console.log(json[grade].grade)
    if (!json[grade].grader.includes("Bedömd vid inlämning") && !json[grade].grader.includes("Umbridge") && !json[grade].assignment_name.includes("quiz") && json[grade].grade !== "U") {
      // console.log(json[grade])
      finalData.push({
        "grader": json[grade].grader,
        "grade": json[grade].grade,
        "kmom": json[grade].assignment_name
      })

      if (latestGrades[json[grade].grader] === undefined) {
        latestGrades[json[grade].grader] = new Date(json[grade].current_graded_at)
      } else {
        latestGrades[json[grade].grader] = new Date(json[grade].current_graded_at) > new Date(latestGrades[json[grade].grader]) ? new Date(json[grade].current_graded_at) : new Date(latestGrades[json[grade].grader])
      }
    }
  }

  assignments = [...new Set(finalData.map(item => item.kmom))]
  assignments.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  if (assignments.at(-1).includes("Tentamen")) {
    assignments.splice(assignments.length - 2, 0, assignments.pop())
  }
}



function menu () {
  console.log(`
    This is the Grader 2.0 script, this time in JS!
    Run scripts with "npm start <command>"
    -------------------------------------------
    Command        Description
    -------------------------------------------
    fetch          Fetches new data from Canvas
    json           Prints the gradebook in JSON
    magic          Parse the data and print table
    count <name>   Prints Date and count of <name>
    `)
}
function cleanExit (exitCode = 0, msg) {
  console.info(`Message: ${msg}`)
  menu()
  process.exit(exitCode)
}

async function fetchData (BASE_URL, COURSE_ID, TOKEN, silent) {
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
      if (!silent) {
        console.info(`Fetched: ${result.length} grades`)
      }
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



async function magic(extra) {
  await parseData()
  const result = await generate()
  const sortedObject = Object.fromEntries(
      Object.entries(result).sort(([, a], [, b]) => b["Total"] - a["Total"])
  )
  const temp_total = sortedObject["Total"]
  // const temp_genom = sortedObject["Genomströmning"]

  delete sortedObject["Total"]
  // delete sortedObject["Genomströmning"]

  sortedObject["Total"] = temp_total

  // sortedObject["Genomströmning"] = temp_genom

  if (extra === "time") {
    console.table(sortedObject, assignments.concat(["Total", "%", "G", "%G", "Senast"]))

  } else {
  console.table(sortedObject, assignments.concat(["Total", "%", "G", "%G"]))

  }
}

async function getCount(name) {
  await parseData()
  let result = {}
  let sortedCount = []
  let names = {}
  for (const item of json) {
    // if (item.grade === null) continue
    if (!item.grader.includes("Bedömd vid inlämning") && !item.grader.includes("Umbridge") && !item.assignment_name.includes("quiz") && item.grade !== "U") {

      if (item.grader.toLowerCase().indexOf(name) > -1) {
        let theDate = new Date(item.graded_at).toLocaleDateString("sv-SE")
        result[theDate] = result[theDate] == undefined ? 1 : result[theDate]+1
        names[item.grader] = names[item.grader] == undefined ? 1 : names[item.grader]+1
      }
    }
  }


  const sortedEntries = Object.entries(result).sort(([dateA], [dateB]) =>
      new Date(dateA) - new Date(dateB)
  )
  sortedCount = Object.fromEntries(sortedEntries)
  
  console.table(sortedCount)
  console.table(names)
}

export {
  cleanExit,
  fetchData,
  printJSON,
  menu,
  parseData,
  magic,
  getCount
}
