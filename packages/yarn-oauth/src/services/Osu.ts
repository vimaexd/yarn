import axios from "axios";

export default {
  name: "osu",
  renew: async () => {
    try {
      const osu_oauth = await axios.post("https://osu.ppy.sh/oauth/token", {
        client_id: process.env.OSU_CLIENTID,
        client_secret: process.env.OSU_CLIENTSECRET,
        grant_type: "client_credentials",
        scope: "public"
      })
      if(!osu_oauth.data.access_token) throw "No osu! bearer token"
      return `Bearer ${osu_oauth.data.access_token}`;
      console.log("Token obtained for Osu")
    } catch(err) {
      console.log("Error renewing Osu token!")
    }
  }
}