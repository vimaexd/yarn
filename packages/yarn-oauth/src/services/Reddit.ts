import axios from "axios";

export default {
  name: "womboart",
  renew: async () => {

    // this probably rotates, but i havent figured out how to extract it yet
    const key = "AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw";

    try {
      const oauth = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`, 
        {
          "returnSecureToken": true
        }
      )
      if(!oauth.data.idToken) throw "No wombo bearer token"
      return `Bearer ${oauth.data.idToken}`;
    } catch(err) {
      console.log("Error renewing wombo token!")
    }
  }
}