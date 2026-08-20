import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminConfig extends Document {
  passwordHash: string;
  updatedAt: Date;
}

const AdminConfigSchema: Schema<IAdminConfig> = new Schema(
  {
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminConfig: Model<IAdminConfig> =
  mongoose.models.AdminConfig || mongoose.model<IAdminConfig>("AdminConfig", AdminConfigSchema);

export default AdminConfig;
