import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Log from "../classes/Log";

const log = new Log({ prefix: "APIManager", color: "blue" })

export const hypixel = axios.create({ baseURL: "https://api.hypixel.net", headers: { "API-Key": process.env.HYPIXEL_TOKEN }})
export const beatsaver = axios.create({ baseURL: "https://beatsaver.com/api", headers: { "User-Agent": "yarn/4.0.0" } })
export const urban = axios.create({ baseURL: "https://api.urbandictionary.com/v0" })
export const osu = axios.create({ baseURL: "https://osu.ppy.sh/api/v2" })
export const reddit = axios.create({ baseURL: "http://oauth.reddit.com"})

const doAuth = async () => {
  try {
    const osu_oauth = await axios.post("https://osu.ppy.sh/oauth/token", {
      client_id: process.env.OSU_CLIENTID,
      client_secret: process.env.OSU_CLIENTSECRET,
      grant_type: "client_credentials",
      scope: "public"
    })
    if(!osu_oauth.data.access_token) throw "No osu! bearer token"
    osu.interceptors.request.use(config => {
      config.headers["Authentication"] = `Bearer ${osu_oauth.data.access_token}`
      return config;
    })
    log.log("Token obtained for service osu!")
  } catch(err) {
    console.log(err)
  }

  try {
    const reddit_oauth = await axios.post(
    "https://www.reddit.com/api/v1/access_token", 
    "grant_type=client_credentials", 
    {
      auth: {
        username: process.env.REDDIT_CLIENTID,
        password: process.env.REDDIT_CLIENTSECRET
      }
    })
    if(!reddit_oauth.data.access_token) throw "No reddit bearer token"

    reddit.interceptors.request.use(config => {
      config.headers["Authorization"] = `Bearer ${reddit_oauth.data.access_token}`
      return config;
    })
    log.log("Token obtained for service reddit")
  } catch(err) {
    console.log(err)
  }
}
doAuth()