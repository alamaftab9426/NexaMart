import UserProfile from "../models/UserProfile.js";

/* ===== SAVE / UPDATE ===== */
export const saveUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    const profilePhoto = req.file?.filename;

    let profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
      profile = new UserProfile({
        user: userId,
        name,
        profilePhoto: profilePhoto
          ? `uploads/users/${profilePhoto}`
          : "",
      });
    } else {
      if (name) profile.name = name;
      if (profilePhoto) {
        profile.profilePhoto = `uploads/users/${profilePhoto}`;
      }
    }

    await profile.save();

    res.status(200).json({
      name: profile.name,
      profilePhoto: profile.profilePhoto,
    });
  } catch (err) {
    console.error("Profile save failed", err);
    res.status(500).json({ error: "Could not save profile" });
  }
};

/* ===== GET ===== */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(200).json({
        name: "",
        profilePhoto: "",
      });
    }

    res.status(200).json({
      name: profile.name,
      profilePhoto: profile.profilePhoto,
    });
  } catch (err) {
    console.error("Get profile error", err);
    res.status(500).json({ error: "Error fetching profile" });
  }
};
