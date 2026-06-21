import PlatformConfig from "../../database/models/PlatformConfig.model.js";

export const getCommissionRate = async () => {
  let config = await PlatformConfig.findOne();
  if (!config) config = await PlatformConfig.create({});
  return config.commissionRate;
};
