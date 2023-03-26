const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const filterObj = require("../utils/filterObj");

const { generateToken04 } = require("./zegoServerAssistant");

// Please change appID to your appId, appid is a number
// Example: 1234567890
const appID = process.env.ZEGO_APP_ID; // type: number

// Please change serverSecret to your serverSecret, serverSecret is string
// Example：'sdfsdfsd323sdfsdf'
const serverSecret = process.env.ZEGO_SERVER_SECRET; // type: 32 byte length string

exports.updateMe = async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "about",
    "avatar"
  );

  const userDoc = await User.findByIdAndUpdate(req.user._id, filteredBody);

  res.status(200).json({
    status: "success",
    data: userDoc,
    message: "User Updated successfully",
  });
};

exports.getUsers = async (req, res, next) => {
  const all_users = await User.find({
    verified: true,
  }).select("firstName lastName _id");

  const this_user = req.user;

  const remaining_users = all_users.filter(
    (user) =>
      !this_user.friends.includes(user._id) &&
      user._id.toString() !== req.user._id.toString()
  );

  res.status(200).json({
    status: "success",
    data: remaining_users,
    message: "Users found successfully!",
  });
};

exports.getRequests = async (req, res, next) => {
  const requests = await FriendRequest.find({ recipient: req.user._id })
    .populate("sender")
    .select("_id firstName lastName");

  res.status(200).json({
    status: "success",
    data: requests,
    message: "Requests found successfully!",
  });
};

exports.getFriends = async (req, res, next) => {
  const this_user = await User.findById(req.user._id).populate(
    "friends",
    "_id firstName lastName"
  );
  res.status(200).json({
    status: "success",
    data: this_user.friends,
    message: "Friends found successfully!",
  });
};

/**
 * Authorization authentication token generation
 */

exports.generateZegoToken = async (req, res, next) => {
  const { userId, room_id } = req.body;

  const effectiveTimeInSeconds = 3600; //type: number; unit: s; token expiration time, unit: second
  const payloadObject = {
    room_id, // Please modify to the user's roomID
    // The token generated allows loginRoom (login room) action
    // The token generated in this example allows publishStream (push stream) action
    privilege: {
      1: 1, // loginRoom: 1 pass , 0 not pass
      2: 1, // publishStream: 1 pass , 0 not pass
    },
    stream_id_list: null,
  }; //
  const payload = JSON.stringify(payloadObject);
  // Build token
  const token = generateToken04(
    appID*1, // APP ID NEEDS TO BE A NUMBER
    userId,
    serverSecret,
    effectiveTimeInSeconds,
    payload
  );
  res.status(200).json({
    status: "success",
    message: "Token generated successfully",
    token,
  });
};
