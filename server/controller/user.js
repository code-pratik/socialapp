import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const viewerId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.viewedProfile.includes(viewerId)) {
      user.viewedProfile.push(viewerId);
      await user.save();
    }

    res.status(200).json({ user });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const format = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(format);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const addremoveFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateProfileViews = async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: id }, { $inc: { viewedProfile: 1 } });
    res.status(200).json({ message: "Added ProfileView" });
  } catch (error) {
    res.status(500).json({ error: err });
  }
};
