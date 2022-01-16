import { Guild } from "discord.js";
import { PremiumTiers } from "discord.js/typings/enums";

export const getMaxUploadSize = (guild: Guild) => {
  if(guild.premiumTier == PremiumTiers.TIER_3.toString()) return 100 * 1000000 // 100MB
  else if(guild.premiumTier == PremiumTiers.TIER_2.toString()) return 50 * 1000000 // 50MB
  else return 8 * 1000000 // 8MB
}