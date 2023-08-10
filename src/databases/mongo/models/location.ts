// ❌ ! - Note: Don't change this file - ! ❌//

import { Schema } from "mongoose";

const LocationSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

export default LocationSchema;

// ❌ ! - Note: Don't change this file - ! ❌//
