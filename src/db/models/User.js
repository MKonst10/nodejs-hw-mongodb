import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../../constants/users.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
      require: true,
    },
    createdAt: {},
    updatedAt: {},
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
