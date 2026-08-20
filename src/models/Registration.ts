import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegistration extends Document {
  title: string;
  subtitle?: string;
  slug: string;
  googleFormUrl: string;
  about?: string;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    social?: string;
  };
  terms?: string;
  isActive: boolean;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema: Schema<IRegistration> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    googleFormUrl: {
      type: String,
      required: [true, "Google Form URL is required"],
      trim: true,
    },
    about: {
      type: String,
      default: "",
    },
    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      website: { type: String, default: "" },
      social: { type: String, default: "" },
    },
    terms: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Registration: Model<IRegistration> =
  mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
