const User = require("../models/User");

// GET /api/users/profile → Logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch profile", error });
  }
};

// POST /api/users/request-certificate → User requests character certificate
exports.requestCertificate = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.certificateRequested) {
      return res.status(400).json({ message: "Request already submitted" });
    }

    // Check reapply condition: previously rejected and request date exists
    if (
      user.certificateRequested === false &&
      user.certificateApproved === false &&
      user.certificateRequestDate
    ) {
      const lastDate = new Date(user.certificateRequestDate);
      const now = new Date();
      const diffInDays = (now - lastDate) / (1000 * 60 * 60 * 24);

      if (diffInDays < 7) {
        const daysLeft = Math.ceil(7 - diffInDays);
        return res.status(403).json({ message: `You can reapply in ${daysLeft} day(s)` });
      }
    }

    user.certificateRequested = true;
    user.certificateApproved = undefined; // Reset approval status
    user.certificateRequestDate = new Date();

    await user.save();

    res.status(200).json({ message: "Certificate request submitted" });
  } catch (error) {
    console.error("Error requesting certificate:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST /api/users/cancel-certificate → Cancel request
exports.cancelCertificateRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.certificateRequested) {
      return res.status(400).json({ message: "No certificate request to cancel" });
    }

    user.certificateRequested = false;
    user.certificateApproved = undefined;
    user.certificateRequestDate = null;

    await user.save();

    res.status(200).json({ message: "Request cancelled successfully" });
  } catch (err) {
    console.error("Cancel request failed:", err);
    res.status(500).json({ message: "Failed to cancel request" });
  }
};
