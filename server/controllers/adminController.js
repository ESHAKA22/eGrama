const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const generateCertificateHTML = require("../templates/certificateTemplate");

// Register a new user (by Admin with photo upload)
exports.registerUser = async (req, res) => {
  try {
    // Check required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'password', 'maritalStatus',
      'phoneNumber', 'currentAddress', 'villageAddress'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Parse nested fields safely
    const emergencyContact = req.body.emergencyContact 
      ? JSON.parse(req.body.emergencyContact)
      : { name: '', relationship: '', phone: '' };

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user object
    const newUser = new User({
      ...req.body,
      emergencyContact,
      familyMembers: JSON.parse(req.body.familyMembers || '[]'),
      dependentsInfo: JSON.parse(req.body.dependentsInfo || '[]'),
      criminalRecord: JSON.parse(req.body.criminalRecord || '{}'),
      behavior: JSON.parse(req.body.behavior || '{}'),
      servicesRequired: JSON.parse(req.body.servicesRequired || '[]'),
      password: hashedPassword,
      profilePhoto: req.file ? req.file.path : null
    });

    // Save user
    await newUser.save();

    // Send email with credentials
    await sendEmail(
      req.body.email,
      "Your Account Credentials",
      `Your account has been created in the Village Management System.\n\nLogin Details:\nEmail: ${req.body.email}\nPassword: ${req.body.password}\n\nPlease change your password after first login.`
    );

    res.status(201).json({ 
      message: "User registered successfully", 
      userId: newUser._id 
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Registration failed",
      error: error.message 
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    
    // Handle file upload if exists
    if (req.file) {
      updates.profilePhoto = req.file.path;
    }

    // Parse nested fields
    if (updates.emergencyContact) {
      updates.emergencyContact = JSON.parse(updates.emergencyContact);
    }
    if (updates.familyMembers) {
      updates.familyMembers = JSON.parse(updates.familyMembers);
    }
    if (updates.dependentsInfo) {
      updates.dependentsInfo = JSON.parse(updates.dependentsInfo);
    }
    if (updates.criminalRecord) {
      updates.criminalRecord = JSON.parse(updates.criminalRecord);
    }
    if (updates.behavior) {
      updates.behavior = JSON.parse(updates.behavior);
    }
    if (updates.servicesRequired) {
      updates.servicesRequired = JSON.parse(updates.servicesRequired);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ 
      message: "Update failed", 
      error: error.message 
    });
  }
};

//getUser by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -profilePhoto"); // Exclude both password and profilePhoto
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q;
    const results = await User.find({
      $or: [
        { firstName: { $regex: keyword, $options: "i" } },
        { lastName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    }).select("-password");

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
};

// Approve or reject certificate
exports.approveCertificate = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.certificateApproved = status;
    await user.save();

    res.json({ message: `Certificate ${status ? "approved" : "rejected"}` });
  } catch (error) {
    res.status(500).json({ message: "Approval failed", error });
  }
};

// Download character certificate PDF (admin-side)
exports.downloadCertificate = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.certificateApproved) {
      return res.status(403).json({ message: "Certificate not approved yet." });
    }

    const certDir = path.join(__dirname, "../uploads/certificates");
    if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

    const filePath = path.join(certDir, `certificate-${user._id}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Use plain text version from HTML template function
    const html = generateCertificateHTML(user);
    doc.font('Times-Roman').fontSize(18).text("OFFICIAL CHARACTER CERTIFICATE", {
      align: "center",
    });
    doc.moveDown();
    doc.fontSize(12).text("Issued by the Village Management System", {
      align: "center",
    });
    
    doc.moveDown(2);
    doc.fontSize(12).text(`This is to certify that ${user.firstName} ${user.lastName}, holder of National Identification Card No. ${user.identificationNumber}, residing at ${user.villageAddress}, is a bonafide resident of our village and is known to be a respectable and law-abiding citizen.`, {
      align: "justify"
    });
    
    doc.moveDown();
    doc.text(`Date of Birth: ${new Date(user.dateOfBirth).toLocaleDateString()}`);
    doc.text(`Marital Status: ${user.maritalStatus}`);
    doc.text(`Community Participation: ${user.behavior?.villageContribution || "Active and cooperative"}`);
    doc.text(`Living Conditions: ${user.behavior?.livingConditions || "Satisfactory"}`);
    doc.text(`Criminal Record: ${user.criminalRecord?.hasRecord ? "Yes" : "No"}`);
    
    if (user.criminalRecord?.hasRecord) {
      doc.text(`Details: ${user.criminalRecord.details}`);
    }
    
    doc.moveDown();
    doc.text("This certificate is issued upon request for official purposes and confirms that the above-named individual has maintained good standing within our community during their period of residence.", {
      align: "justify"
    });
    
    doc.moveDown(2);
    doc.text("_________________________", {
      align: "right"
    });
    doc.text("Grama Niladhari Officer", {
      align: "right"
    });
    doc.text("Village Management System", {
      align: "right"
    });
    
    doc.moveDown();
    doc.fontSize(10).text(`Issued on: ${new Date().toLocaleDateString()}`, {
      align: "center"
    });
    doc.text(`Certificate ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`, {
      align: "center"
    });
    doc.text("This document is valid only with the official seal and signature", {
      align: "center"
    });
    

    doc.end();

    stream.on("finish", async () => {
      user.certificatePath = filePath;
      await user.save();
      res.download(filePath); // Trigger download
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: "Failed to generate certificate", error });
  }
};
