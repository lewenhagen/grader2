import * as fs from 'fs'

async function fetchJson(url, token) {
  const headers = {
    Authorization: `Bearer ${token}`
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function fetchJsonWithHeaders(url, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const linkHeader = res.headers.get('link');
  const nextUrl = parseLinkHeader(linkHeader)?.next;

  return { data, nextUrl };
}

function parseLinkHeader(header) {
  if (!header) return null;

  const links = {};
  const parts = header.split(',');

  for (const part of parts) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      const [, url, rel] = match;
      links[rel] = url;
    }
  }

  return links;
}

async function getSections(baseUrl, courseId, token) {
  const url = `${baseUrl}/api/v1/courses/${courseId}/sections?per_page=100`;
  return fetchJson(url, token);
}

async function getEnrollments(baseUrl, token, sectionId) {
  let url = `${baseUrl}/api/v1/sections/${sectionId}/enrollments?per_page=100`;
  const allData = [];

  while (url) {
    const { data, nextUrl } = await fetchJsonWithHeaders(url, token);
    allData.push(...data);
    url = nextUrl;
  }

  return allData;
}

async function getInfo(baseUrl, courseId, token, arg, save) {
  const sections = await getSections(baseUrl, courseId, token);
  const result = {};

  for (const section of sections) {
    const enrollments = await getEnrollments(baseUrl, token, section.id);
    if (arg === "mail") {
      const sisIds = enrollments
      .filter(e => e.user && e.user.login_id.includes("@"))
      .map(e => e.user.login_id );

      result[section.name] = sisIds.sort();

    } else if (arg === "acro") {
      const sisIds = enrollments
      .filter(e => e.user && e.user.login_id.includes("@"))
      .map(function(e) {
        const match = e.user.login_id.match(/^([^@]+)/);
        if (match) {
          return match[1]
        }
      });

      result[section.name] = sisIds.sort();
    }
    
  }

  if (save) {
    fs.writeFileSync(`./output/info_${arg}.json`, JSON.stringify(result, null, 4))
    console.log(`Saved output to output/info_${arg}.json`)
  } else {
    console.table(JSON.stringify(result, null, 4))
  }
}

export { getInfo }
