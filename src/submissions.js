#!/usr/bin/env node

async function getAssignments(baseUrl, courseId, apiToken) {
    const url = `${baseUrl}/api/v1/courses/${courseId}/assignments`
    const headers = {
        'Authorization': `Bearer ${apiToken}`
    }
    try {
        const response = await fetch(url, { headers })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error getting assignments:', error)
        throw error
    }
}

async function getSections(baseUrl, courseId, apiToken) {
    const url = `${baseUrl}/api/v1/courses/${courseId}/sections`
    const headers = {
        'Authorization': `Bearer ${apiToken}`
    }
    try {
        const response = await fetch(url, { headers })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error getting sections:', error)
        throw error
    }
}

async function getEnrollments(baseUrl, sectionId, apiToken) {
    const url = `${baseUrl}/api/v1/sections/${sectionId}/enrollments`
    const headers = {
        'Authorization': `Bearer ${apiToken}`
    }

    let allEnrollments = []
    let nextUrl = url

    while (nextUrl) {
        const response = await fetch(nextUrl, { headers })
        const data = await response.json()

        allEnrollments = allEnrollments.concat(data)

        const linkHeader = response.headers.get('link')
        if (linkHeader && linkHeader.includes('rel="next"')) {
            const nextPageUrl = linkHeader.match(/<([^>]+)>; rel="next"/)
            nextUrl = nextPageUrl ? nextPageUrl[1] : null
        } else {
            nextUrl = null
        }
    }

    return allEnrollments
}

async function getSubmissions(baseUrl, sectionId, assignmentId, apiToken) {
    const url = `${baseUrl}/api/v1/sections/${sectionId}/assignments/${assignmentId}/submissions`
    const headers = {
        'Authorization': `Bearer ${apiToken}`
    }

    let allSubmissions = []
    let nextUrl = url

    while (nextUrl) {
        const response = await fetch(nextUrl, { headers })
        const data = await response.json()

        allSubmissions = allSubmissions.concat(data)

        const linkHeader = response.headers.get('link')
        if (linkHeader && linkHeader.includes('rel="next"')) {
            const nextPageUrl = linkHeader.match(/<([^>]+)>; rel="next"/)
            nextUrl = nextPageUrl ? nextPageUrl[1] : null
        } else {
            nextUrl = null
        }
    }

    return allSubmissions
}

async function countSubmissions(baseUrl, courseId, apiToken, sectionNameSubstring, assignmentSubstring, options) {
    try {
        const sections = await getSections(baseUrl, courseId, apiToken)
        const section = sections.find(section => section.name.toLowerCase().includes(sectionNameSubstring.toLowerCase()))

        if (!section) {
            console.log(`No section found with name containing: ${sectionNameSubstring}`)
            return
        }

        const sectionId = section.id

        !options.silent && console.log(`Found section: ${section.name} (ID: ${sectionId})`)

        const enrollments = await getEnrollments(baseUrl, sectionId, apiToken)
        !options.silent && console.log(`Got ${enrollments.length} enrollments in section: ${sectionId} (${section.name})`)
        const studentIds = new Set(enrollments.map(enrollment => enrollment.user_id))
        const assignments = await getAssignments(baseUrl, courseId, apiToken)
        !options.silent && console.log(`Got ${assignments.length} assignments in course: ${courseId}
Assignments: ${assignments.map((item) => item.name)}`)

        let submissionCount = 0

        for (const assignment of assignments) {
            if (assignment.name.toLowerCase().includes(assignmentSubstring.toLowerCase())) {
                const submissions = await getSubmissions(baseUrl, sectionId, assignment.id, apiToken)
                !options.silent && console.log(`Got a total of ${submissions.length} submissions (all sections) for assignment: ${assignment.id} (${assignment.name})`)
                submissions.forEach(submission => {
                    if (studentIds.has(submission.user_id)) {
                        if (["graded", "submitted"].includes(submission.workflow_state)) {
                            submissionCount++
                        }
                    }
                })
            }

        }

        console.log(`Total submissions for section '${section.name}': ${submissionCount}`)
    } catch (error) {
        console.error('Error counting submissions:', error)
    }
}


export { countSubmissions }
