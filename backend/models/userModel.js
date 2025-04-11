const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // Added username
    name: { type: String }, // Made optional
    email: { type: String, unique: true, sparse: true }, // Made optional
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true } // Fixed typo: timestaps -> timestamps
);

// Uncomment and use these methods if needed for password hashing
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) { // Fixed condition
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Use mongoose.models to prevent redefinition
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;