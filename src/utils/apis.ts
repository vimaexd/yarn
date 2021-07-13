import axios from "axios";

export const disq = axios.create({
  baseURL: "https://api.disq.me",
  headers: {
    "token": process.env.DISQ_TOKEN
  }
})

export const hypixel = axios.create({
  baseURL: "https://api.hypixel.net",
  headers: {
    "API-Key": process.env.HYPIXEL_TOKEN
  }
})

export const beatsaver = axios.create({
  baseURL: "https://beatsaver.com/api",
  headers: {
    "User-Agent": "yarn/4.0.0"
  }
})

export const urban = axios.create({
  baseURL: "https://api.urbandictionary.com/v0"
})