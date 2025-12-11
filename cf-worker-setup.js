const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const EXCHANGE_URL = process.env.EXCHANGE_URL || "";
const WORKER_NAME = process.env.WORKER_NAME || "exchanger-client-web";
if(!CF_TOKEN){
  throw new Error("env CLOUDFLARE_API_TOKEN was not defined.")
}
if(!EXCHANGE_URL){
  throw new Error("env EXCHANGE_URL was not defined.")
}
async function apiCf(method, body) {
  const [typeMethod, methodPath] = method.split(":")
  return fetch("https://api.cloudflare.com/client/v4" + methodPath, {
    method: typeMethod,
    headers: {
      "Authorization": `Bearer ${CF_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  })
    .then(response => {
      if (response.status !== 200) {
        return Promise.reject(response.status + " - " + response.statusText + " - " + method)
      }
      return response.json()
    })
    .then((stream) => stream.result)
}

(async () => {
  const zones = await apiCf("GET:/zones")
    .then((result) => result.map(item => {
      return {id: item.id, name: item.name}
    }))
  if (!zones) {
    throw new Error("Error: Error get zones list.")
  }
  if (!zones.length) {
    throw new Error("Error: Your CF account don't have domains.")
  }
  const zoneMatch = zones.find(zoneItem => {
    return EXCHANGE_URL.indexOf(zoneItem.name) !== -1;
  });
  console.log("Zone for apply routes", zoneMatch.name, zoneMatch.id);
  if (!zoneMatch) {
    throw new Error("Error: Zone for [" + EXCHANGE_URL + "] not found.")
  }
  const zone_id = zoneMatch.id;
  const routesList = await apiCf(`GET:/zones/${zone_id}/workers/routes`)


  const setRoutes = [
    {pattern: `${EXCHANGE_URL}/*`, script: WORKER_NAME},
    {pattern: `${EXCHANGE_URL}/service*`, script: null},
    {pattern: `${EXCHANGE_URL}/ws*`, script: null},
    {pattern: `${EXCHANGE_URL}/ref*`, script: null},
    {pattern: `${EXCHANGE_URL}/tg*`, script: null},
  ];

  // console.log('zones', zones);
  // console.log('routesList', routesList);
  // console.log('setRoutes', setRoutes);
  for (let routeItem of setRoutes) {
    const existRoute = routesList.find(route => {
      return route.pattern === routeItem.pattern
    })
    if (existRoute) {
      console.log("Route already exist:", routeItem.pattern, `[${existRoute.id}]`)
      continue;
    }
    const createRoute = await apiCf(`POST:/zones/${zone_id}/workers/routes`, {
      pattern: routeItem.pattern,
      script: routeItem.script
    })
    console.log('New route:', `${routeItem.pattern} -> ${routeItem.script || "no worker"} [${createRoute.id}]`)
  }
})()
