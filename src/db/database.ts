import Mongoose from 'mongoose';

export const connectToDB = async (uri: string) => {
  try {
    await Mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch {
    console.log("Failed to connect to MongoDB!")
  }
}