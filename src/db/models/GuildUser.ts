import { Schema, model, connect } from 'mongoose';

interface GuildUser {
  guildId: string;
  userId: string;
  xp: {
    amount: number;
    level: number;
  }
}

const schema = new Schema<GuildUser>({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  xp: {
    amount: { type: Number, required: true },
    level: { type: Number, required: true }
  }
});

export default model<GuildUser>('GuildUser', schema);