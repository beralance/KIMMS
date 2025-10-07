import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import StaffPermission from '../models/StaffPermission.js';
import { generateCode } from '../utils/generateCode.js';
import { sendEmail } from '../utils/sendEmail.js';

// SIGN UP (user)
export const signup = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber, address} = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already used' });
        }

        // create verification code
        const code = generateCode(6);
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const newUser = new User({
            email,
            password,
            fullName,
            phoneNumber,
            address,
            role: 'user',
            isVerified: false,
            isLocal: address.region === '05',
            verificationCode: code,
            verificationExpiry: expiry,
        });

        await newUser.save();

        console.log('EMAIL: ', email)
        // send email
        await sendEmail({
            to: email,
            subject: 'Verify Your Account',
            text: `Your verification code is ${code}`,
            html: `<p>Your verification code is <b>${code}</b>. It will expire in 10 minutes.</p>`,
        });

        res.status(201).json({
            message: 'Signup successful. Please verify your email.',
            userId: newUser._id,
            email: newUser.email,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        console.log('user', user, email)
        const isLocal = user.address.region === '05'

        if (!user) return res.status(400).json({ error: 'User not found' });
        if (user.isVerified) return res.status(400).json({ error: 'Already verified' });

        if (
            user.verificationCode !== code ||
            !user.verificationExpiry ||
            user.verificationExpiry < new Date()
        ) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        user.isVerified = true;
        user.verificationCode = null;
        user.verificationExpiry = null;
        await user.save();

        // generate token after verification
        const token = jwt.sign(
            { id: user._id, role: user.role, isLocal},
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            message: 'Email verified successfully',
            token,
            userId: user._id,
            role: user.role,
            fullName: user.fullName,
            isLocal,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// RESEND CODE
export const resendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: 'User not found' });
        if (user.isVerified) return res.status(400).json({ error: 'Already verified' });

        const code = generateCode(6);
        const expiry = new Date(Date.now() + 10 * 60 * 1000);

        user.verificationCode = code;
        user.verificationExpiry = expiry;
        await user.save();

        await sendEmail(
            {
                to: email,
                subject: 'Verify Your Account',
                text: `Your new verification code is ${code}`,
                html: `<p>Your verification code is <b>${code}</b>. It will expire in 10 minutes.</p>`,
            },
        );

        res.json({ message: 'Verification code resent' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN (admin, staff, user)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        let isLocal = null;

        if (user.role !== 'admin' && user.role !== 'staff') {
            isLocal = user.address?.region === '05'
        }

        // ensure verified
        if (!user.isVerified) {
            return res.status(400).json({ error: 'Please verify your email before logging in' });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role, isLocal: isLocal },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        let allowedModules = [];
        if (user.role === 'staff') {
            const staffPerm = await StaffPermission.findOne({ staffId: user._id });
            if (staffPerm) allowedModules = staffPerm.allowedModules;
        }

        res.json({
            message: 'Login successful',
            userId: user._id,
            role: user.role,
            fullName: user.fullName,
            address: user.address,
            isLocal,
            allowedModules,
            token,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE STAFF (admin only)
export const createStaff = async (req, res) => {
    try {
        const { email, password, fullName, allowedModules } = req.body;
        const adminId = req.user.id;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already used' });

        const staff = new User({
            email,
            password,
            fullName,
            role: 'staff',
        });

        await staff.save();

        const staffPermission = new StaffPermission({
            staffId: staff._id,
            adminId,
            allowedModules,
        });
        await staffPermission.save();

        res.status(201).json({
            message: 'Staff created successfully',
            staffId: staff._id,
            fullName: staff.fullName,
            allowedModules: staffPermission.allowedModules,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE STAFF (admin only)
export const deleteStaff = async (req, res) => {
    try {
        const { staffId } = req.params;

        const staff = await User.findById(staffId);
        if (!staff || staff.role !== 'staff') {
            return res.status(400).json({ error: 'Invalid staff account' });
        }

        await User.findByIdAndDelete(staffId);
        await StaffPermission.findOneAndDelete({ staffId });

        res.json({ message: 'Staff account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
