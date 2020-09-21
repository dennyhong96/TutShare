const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 12,
      unique: true,
      lowercase: true,
      index: true, // Increase query performance
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    interestedIn: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Category",
        },
      ],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash user's password before saving / updating
userSchema.pre("save", async function (next) {
  console.log("PRE SAVE TRIGGERED");
  console.log(this.isNew, this.isModified("password"));
  if (!(this.isNew || this.isModified("password"))) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Verify if password is correct
userSchema.methods.passwordIsCorrect = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Generate jwt token for user
userSchema.methods.genJwtToken = function () {
  const payload = { id: this._id };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

module.exports = mongoose.model("User", userSchema);
