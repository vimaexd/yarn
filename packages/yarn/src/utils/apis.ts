import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const hypixel = axios.create({ baseURL: "https://api.hypixel.net", headers: { "API-Key": process.env.HYPIXEL_TOKEN }})
export const beatsaver = axios.create({ baseURL: "https://beatsaver.com/api", headers: { "User-Agent": "yarn/4.0.0" } })
export const urban = axios.create({ baseURL: "https://api.urbandictionary.com/v0" })
export const osu = axios.create({ baseURL: "https://osu.ppy.sh/api/v2" })
export const reddit = axios.create({ baseURL: "http://oauth.reddit.com" })

const updateAuth = () => {
  let timeout;

  axios.get('http://oauth:9090/', { headers: { "User-Agent": "yarn/4.0.0" }})
  .then(res => {
    const tokens = res.data;
    if(tokens === {}) return;

    osu.interceptors.request.use((r => {
      r.headers["Authorization"] = tokens.osu;
      return r;
    }));

    reddit.interceptors.request.use((r => {
      r.headers["Authorization"] = tokens.reddit;
      return r;
    }));

    timeout = tokens.timeout;
  })
  .catch(err => {
    console.log("Error updating OAuth Tokens!");
    console.log(err);
  })

  setTimeout(updateAuth, timeout || 1800000);
}
updateAuth();