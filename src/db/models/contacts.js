import { Schema, model } from "mongoose";
import { contactTypes } from "../../constants/contacts.js";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      reqired: true,
    },
    phoneNumber: {
      type: String,
      reqired: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
      required: true,
    },
    contactType: {
      type: String,
      enum: contactTypes,
      required: true,
      default: "personal",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", setUpdateSettings);
contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
