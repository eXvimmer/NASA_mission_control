const API_URL = `http://127.0.0.1:8000`;

/**
 * load planets and return as JSON
 */
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

/**
 * Load launches, sort by flight number, and return as JSON.
 */
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const data = await response.json();
  return data.sort((a, b) => a.flightNumber - b.flightNumber);
}

/*
 * Submit given launch data to launch system.
 */
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
