import { Schema, model } from "mongoose";

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
      enum: ["work", "home", "personal"],
      required: true,
      default: "personal",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Contact = model("contact", contactSchema);

export default Contact;
