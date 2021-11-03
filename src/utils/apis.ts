import axios from "axios";

/*
  Disq
  requires auth: yes
*/
export const disq = axios.create({
  baseURL: "https://api.disq.me",
  headers: {
    "token": process.env.DISQ_TOKEN
  }
})

/*
  Hypixel
  requires auth: yes
*/
export const hypixel = axios.create({
  baseURL: "https://api.hypixel.net",
  headers: {
    "API-Key": process.env.HYPIXEL_TOKEN
  }
})

/*
  Beat Saver
  requires auth: no
*/
export const beatsaver = axios.create({
  baseURL: "https://beatsaver.com/api",
  headers: {
    "User-Agent": "yarn/4.0.0"
  }
})

/*
  Urban Dictionary
  requires auth: no
*/
export const urban = axios.create({
  baseURL: "https://api.urbandictionary.com/v0"
})

/*
  osu!
  requires auth: yes
*/
export const osu = axios.create({
  baseURL: "https://osu.ppy.sh/api/v2"
})

// osu.interceptors.request.use(async config => {
//   const oauth = await axios.post("https://osu.ppy.sh/oauth/token", {
//     client_id: process.env.OSU_CLIENTID,
//     client_secret: process.env.OSU_CLIENTSECRET,
//     grant_type: "client_credentials",
//     scope: "public"
//   })
//   if(!oauth.data.access_token) return config;
//   config.headers = {
//     "Authorization": `Bearer ${oauth.data.access_token}`
//   }
//   return config;
// })