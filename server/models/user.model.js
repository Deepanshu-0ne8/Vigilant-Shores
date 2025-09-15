import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: [true, "user name is required"],
    trim: true,
    minlength: [2, "user name must be at least 3 characters"],
    maxlength: [100, "user name must be at most 100 characters"]
    },
    email: {
    type: String,
    required: [true, 'user email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'please fill a valid email address']
    },
    password: {
    type: String,
    required: [true, 'user password is required'],
    minlength: [6, 'password must be at least 6 characters'],
    maxlength: [128, 'password must be at most 128 characters']
    },
    role: {
    type: String,
    enum: ['citizen', 'analyst'],
    default: 'citizen'
    }
} , {timestamps: true} /*this maintains createdAt and updatedAt*/ );

const User = mongoose.model('User', userSchema);

export default User;
