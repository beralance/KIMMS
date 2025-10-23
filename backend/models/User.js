import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: {type: String, required: function() {return !this.googleId}},
    fullName: {type: String, required: true},
    role: { type: String, enum: ['user', 'admin', 'staff'], default: 'user'},
    isLocal: {type: Boolean, default: false},
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'other'
    },
    pendingEmail: {type: String},
    
    // OAuth info
    googleId: { type: String, unique: true, sparse: true},
    avatar: {type: String},
    lastLogin: {type: Date},

    // contact 
    phoneNumber: {type: String, required: false}, // optional, can be used on checkout

    // address
    address: {
        street: {type: String},
        city: {type: String},
        province: {type: String},
        region: {type: String},
        postalCode: {type: String},
        country: {type: String, default: 'Philippines'},
    },

    // Verify fields
    isVerified: { type: Boolean, default: false},
    verificationCode: {type: String}, // store 6 digit code
    verificationExpiry: {type: Date}, // code expiry time
}, {timestamps: true});

// hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }catch (hashError) {
        return next(new Error('Password hashing failed'))
    }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) {
        return false
    }
    return await bcrypt.compare(candidatePassword, this.password)
}


const User = mongoose.model('User', userSchema)
export default User