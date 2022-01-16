import axios from "axios";

export default {
  name: "reddit",
  renew: async () => {
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
      return `Bearer ${reddit_oauth.data.access_token}`;
    } catch(err) {
      console.log("Error renewing Reddit token!")
    }
  }
}