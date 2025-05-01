const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    nationality: { type: String, required: true },
    identificationNumber: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
    },

    currentAddress: { type: String, required: true },
    villageAddress: { type: String, required: true },
    previousAddress: { type: String },

    familyMembers: [
      {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        age: { type: Number },
      },
    ],

    numberOfDependents: { type: Number, required: true },
    dependentsInfo: [
      {
        dob: { type: Date },
        id: { type: String },
      },
    ],

    employmentStatus: { type: String, required: true },
    occupation: { type: String, required: true },
    employerName: { type: String, required: true },
    employerContact: { type: String, required: true },
    annualIncome: { type: Number },

    medicalHistory: { type: String },
    allergies: { type: String },
    disabilities: { type: String },

    criminalRecord: {
      hasRecord: { type: Boolean, default: false },
      details: { type: String },
    },

    vehicleInfo: { type: String },
    reasonForMoving: { type: String },
    preferredHousingType: { type: String },
    servicesRequired: [String],
    communityParticipation: { type: String },
    dataConsent: { type: Boolean, default: false },
    digitalSignature: { type: String },

    behavior: {
      villageContribution: { type: String },
      livingConditions: { type: String },
      illegalActivities: {
        hasRecord: { type: Boolean, default: false },
      },
    },

    // Certificate related
    certificateRequested: { type: Boolean, default: false },
    certificateApproved: { type: Boolean, default: false },
    certificateRequestDate: { type: Date }, // used for reapply logic
    certificateRequestedAt: { type: Date }, // when the user made the request

    // Role and avatar
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePhoto: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
