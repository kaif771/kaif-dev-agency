import { Schema, type Document, models, model } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  budget: number;
  details: string;
  createdAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, "Name or entity is required"],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, "Email coordinates are required"],
    trim: true,
    lowercase: true
  },
  budget: { 
    type: Number, 
    required: [true, "Estimated budget is required"] 
  },
  details: { 
    type: String, 
    required: [true, "Project specifications are required"] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Check if model already compiled, otherwise compile it
const Lead = models.Lead || model<ILead>("Lead", LeadSchema);

export default Lead;
