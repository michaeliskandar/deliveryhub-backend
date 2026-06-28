import Driver from "../../database/models/Driver.js";
import User from "../../database/models/User.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import { getPagination } from "../../shared/utils/pagination.js";

const getAllDrivers = async ({ status, search, page, limit }) => {
  const { skip, take } = getPagination(page, limit);

  const userQuery = { role: "driver" };
  if (status) userQuery.status = status;
  if (search) {
    userQuery.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const matchingUserIds = await User.find(userQuery).distinct("_id");
  const query = { user: { $in: matchingUserIds } };

  const [drivers, total] = await Promise.all([
    Driver.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(take)
      .populate("user", "fullName email phone status profileImage createdAt"),
    Driver.countDocuments(query),
  ]);

  return { drivers, total, page: Number(page) || 1, limit: take };
};

const updateDriverStatus = async (driverId, status) => {
  const driver = await Driver.findById(driverId).populate("user");
  if (!driver) throw ApiError.notFound("Driver not found");

  driver.user.status = status;
  await driver.user.save();

  return driver;
};

const updateDriverAvailability = async (userId, status) => {
  const driver = await Driver.findOne({ user: userId }).populate("user");
  if (!driver) throw ApiError.notFound("Driver profile not found");

  if (!driver.isActive) {
    throw ApiError.badRequest("Cannot change status of a deactivated driver");
  }

  driver.status = status;
  driver.lastActiveAt = new Date();
  await driver.save();

  return driver;
};

export default { getAllDrivers, updateDriverStatus, updateDriverAvailability };
