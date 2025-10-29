import User from '../models/User.js';
import Cart from '../models/Cart.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import StaffPermission from '../models/StaffPermission.js';
import { generateCode } from '../utils/generateCode.js';
import { sendEmail } from '../utils/sendEmail.js';
import { createClient } from '@supabase/supabase-js';
import {v4 as uuidv4} from 'uuid'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const DEFAULT_AVATARS = {
    male: 'https://blbymugxhgylzhdmfgeb.supabase.co/storage/v1/object/public/assets/account-avatar-profile-male-02.svg.svg',
    female: 'https://blbymugxhgylzhdmfgeb.supabase.co/storage/v1/object/public/assets/account-avatar-profile-female-01.svg.svg',
    other: 'https://blbymugxhgylzhdmfgeb.supabase.co/storage/v1/object/public/assets/account-avatar-profile-male-01.svg',
}

// SIGN UP (user)
export const signup = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber, gender, address, googleId, avatar} = req.body;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({error: 'Valid email is required'})
        }
        if (!fullName || typeof fullName !== 'string') {
            return res.status(400).json({error: 'Full name is required'})
        }
        if (!googleId && (!password || typeof password !== 'string' || password.length < 6)) {
            return res.status(400).json({error: 'Password is required for local signup (min 6 chars)'})
        }
        if (phoneNumber && !/^09\d{9}$/.test(phoneNumber)) {
           return res.status(400).json({ error: 'Invalid phone number format' });
        }
        const orCondition = [{email}]
        if (googleId) orCondition.push({googleId})
        // check if user already exists
        const existingUser = await User.findOne({ 
            $or: orCondition
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // if local or google signup
        const isGoogle = !!googleId;
        let code, expiry;
        if (!isGoogle) {
            code = generateCode(6)
            expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        }


        console.log('Avatar', avatar)
        const newUser = new User({
            email,
            password: isGoogle ? null : password,
            fullName,
            phoneNumber,
            address,
            role: 'user',
            isVerified: isGoogle,
            isLocal: !isGoogle && address?.region === '05', // if navigate google sign up to address, only google sign up
            verificationCode: code,
            verificationExpiry: expiry,
            googleId: googleId || undefined,
            gender,
            avatar: avatar || DEFAULT_AVATARS[gender || 'other']
        });

        console.log('NEW USER before save:', newUser)

        await newUser.save();

        if (!isGoogle) {
            // send email
            await sendEmail({
                to: email,
                subject: 'Verify Your Account',
                text: `Your verification code is ${code}`,
                html: `<p>Your verification code is <b>${code}</b>. It will expire in 10 minutes.</p>`,
            });
        }

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role, isLocal: newUser.isLocal },
            process.env.JWT_SECRET,
            {expiresIn: '12h'}
        )

        if (isGoogle) {
            return res.status(201).json({
                message: 'Google signup successful',
                token,
                userId: newUser._id,
                role: newUser.role,
                address: newUser.address,
                fullName: newUser.fullName,
                isLocal: newUser.isLocal,
                email: newUser.email,
                googleId: newUser.googleId,
                avatar: newUser.avatar,
                gender: newUser.gender || '',
                phoneNumber: newUser.phoneNumber || '',
            })
        }
        res.status(201).json({
            message: 'Signup successful. Please verify your email.',
            token,
            userId: newUser._id,
            role: newUser.role,
            address: newUser.address,
            fullName: newUser.fullName,
            isLocal: newUser.isLocal,
            avatar: newUser.avatar,
            email: newUser.email,
            gender: newUser.gender || '',
            phoneNumber: newUser.phoneNumber || '',
        });
    } catch (err) {
        console.error('Signup error deatils: ', err)
        res.status(500).json({ error: err.message });
    }
};

export const updateAddress = async (req, res) => {
    const {userId} = req.params;
    const { address: wrapper } = req.body; // unwrap the frontend object
    const address = wrapper?.address || wrapper; // in case it's double-wrapped

    if (!address) {
        return res.status(400).json({error: 'Address is required'})
    }

    try {
        const isLocal = address.region === '05'

        const user = await User.findByIdAndUpdate(
            userId,
            {address, isLocal},
            {new: true},
        )

        if (!user) {
            return res.status(400).json({error: 'User not found'})
        }

        console.log('USER BACKEND IS LOCAL', user.isLocal)

        const cart = await Cart.findOne({userId}).populate('items.productId')
        if (cart) {
            cart.items = cart.items.filter(
                item => !item.productId?.isLocal || user.isLocal
            )
            await cart.save()
        }

        const token = jwt.sign(
            {id: user._id, role: user.role, isLocal: user.isLocal},
            process.env.JWT_SECRET,
            {expiresIn: '12h'}
        )

        res.json({
            message: 'Address updated successfully',
            address: user.address,
            isLocal: user.isLocal,
            token
        })
    }
    catch (err) {
        console.error(err) 
        res.status(500).json({error: 'Server error'})
    }
}


// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });

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
            { id: user._id, role: user.role},

            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            message: 'Email verified successfully',
            token,
            userId: user._id,
            gender: user.gender,
            role: user.role,
            address: user.address,
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
            avatar: user.avatar
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
            return res.status(400).json({ error: 'Please verify your email before logging in', code: 'notVerified' });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const expiresIn = user.role === 'admin' ? '4h' : '12h';

        const token = jwt.sign(
            { id: user._id, role: user.role, isLocal: isLocal },
            process.env.JWT_SECRET,
            { expiresIn } // from {expiresIn: 12h}
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
            email: user.email,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            isLocal,
            allowedModules,
            avatar: user.avatar,
            token,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GOOGLE LOGIN (user)
export const googleLogin = async (req, res) => {
    try {
        const {email, fullName, googleId, avatar} = req.body

        if (!email || !fullName || !googleId) {
            return res.status(400).json({error: 'Incomplete Google login credenial'})
        }

        let user = await User.findOne({$or: [{email}, {googleId}]})

        if (!user) {
            user = new User ({
                email,
                fullName,
                googleId,
                avatar: avatar || DEFAULT_AVATARS,
                role: 'user',
                isVerified: 'true',
                isLocal: false
            })
            await user.save()
        }

        const token = jwt.sign(
            {id: user._id, role: user.role, isLocal: user.isLocal},
            process.env.JWT_SECRET,
            {expiresIn: '12h'}
        )
        res.status(200).json({
            message: 'Google login successful',
            token,
            userId: user._id,
            fullName: user.fullName,
            role: user.role,
            email: user.email,
            isLocal: user.isLocal,
            address: user.address,
            googleId: user.googleId,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            avatar: user.avatar
        });
    }
    catch (err) {
        console.error(err)
        res.status(500).json({error: 'Server error'})
    }
}

// UPDATE user account (user)
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, gender, phoneNumber, address } = req.body;
        console.log('USER', phoneNumber)
        // Ensure at least one field is provided
        if (!fullName && !gender && !phoneNumber && !address) {
            return res.status(400).json({ error: 'No field to update' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Update fields if provided
        if (fullName) user.fullName = fullName.trim();
        if (gender) user.gender = gender;
        if (phoneNumber && !/^09\d{9}$/.test(phoneNumber)) {
           return res.status(400).json({ error: 'Invalid phone number format' });
        }
        user.phoneNumber = phoneNumber;
        if (address && typeof address !== 'object') {
            return res.status(400).json({error: 'Invlid address format'})
        }

        if (address && typeof address === 'object') {
            user.address = {
                ...user.address,
                ...address,
            };
        }

        await user.save();

        console.log('user user', user)
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                googleId: user.googleId,
                email: user.email,
                fullName: user.fullName,
                gender: user.gender,
                phoneNumber: user.phoneNumber,
                address: user.address,
                role: user.role,
            }
        });

    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ error: 'Server error: failed to update profile' });
    }
};

// Update user password
export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const {currentPassword, newPassword} = req.body;

        console.log('BODY', req.body)
        console.log('User', userId)
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({error: 'User not found'});

        if (user.googleId) {
            return res.status(400).json({error: 'Google user cannot change password'})
        }
        console.log('_____________________________')
        console.log('DEBUG - currentPassword:', currentPassword)
        console.log('DEBUG - currentPassword:', newPassword)
        console.log('DEBUG - user.password:', user.password)
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        console.log('MATCH ', isMatch)
        if (!isMatch) return res.status(400).json({error: 'Current password is incorrect'});

        user.password = newPassword
        await user.save()

        res.status(200).json({message: 'Password updates successfully'})
    }
    catch (err) {
        console.error('Error updating password:', err)
        res.status(500).json({error: 'Server error: failed to update password'})
    }
}

// Update user email
export const updateEmail = async (req, res) => {
    try {
        const userId = req.user.id;
        const { newEmail, currentPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Restrict Google users
        if (user.googleId) {
            return res.status(400).json({ error: 'Google user cannot change email here' });
        }

        // Verify current password for security
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Check if new email already exists
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Generate verification code & expiry (same as signup)
        const code = generateCode(6);
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Store temporary verification data
        user.pendingEmail = newEmail;
        user.verificationCode = code;
        user.verificationExpiry = expiry;
        await user.save();

        // Send verification email
        await sendEmail({
            to: newEmail,
            subject: 'Verify Your New Email Address',
            text: `Your verification code is ${code}`,
            html: `<p>Your verification code is <b>${code}</b>. It will expire in 10 minutes.</p>`,
        });

        res.status(200).json({
            message: 'Verification code sent to your new email. Please verify to complete the update.',
        });
    } catch (err) {
        console.error('Error updating email:', err);
        res.status(500).json({ error: 'Server error: failed to update email' });
    }
};

export const verifyNewEmail = async (req, res) => {
    try {
        const userId = req.user.id;
        const { code } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if there's a pending email
        if (!user.pendingEmail)
        return res.status(400).json({ error: 'No pending email to verify' });

        // Verify code and expiry
        if (user.verificationCode !== code)
        return res.status(400).json({ error: 'Invalid verification code' });

        if (Date.now() > user.verificationExpiry)
        return res.status(400).json({ error: 'Verification code expired' });

        // ✅ Update actual email and clear temp fields
        user.email = user.pendingEmail;
        user.pendingEmail = undefined;
        user.verificationCode = undefined;
        user.verificationExpiry = undefined;

        await user.save();

        res.status(200).json({ message: 'Email updated successfully' });
    } catch (err) {
        console.error('Error verifying new email:', err);
        res.status(500).json({ error: 'Server error: failed to verify email' });
    }
};


export const updateUserAvatar = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const sanitizedOriginal = req.file.originalname.replace(/[\s()]/g, "_");
        const fileName = `avatars/${Date.now()}-${uuidv4()}-${sanitizedOriginal}`;

        // Upload file to Supabase
        const { data, error } = await supabase.storage
            .from("User-Assets")
            .upload(fileName, req.file.buffer, {
                cacheControl: "3600",
                upsert: false,
                contentType: req.file.mimetype,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return res.status(500).json({ error: "Failed to upload avatar" });
        }

        // Generate public URL
        const publicUrl = supabase.storage
            .from("User-Assets")
            .getPublicUrl(fileName).data?.publicUrl;

        if (!publicUrl) return res.status(500).json({ error: "Failed to generate public URL" });

        // Delete old avatar if exists
        if (user.avatar && user.avatar.includes("/User-Assets/")) {
            try {
                const oldPath = user.avatar.split("/User-Assets/")[1];
                if (oldPath) {
                    await supabase.storage.from("User-Assets").remove([oldPath]);
                }
            } catch (delErr) {
                console.warn("Failed to delete old avatar:", delErr);
            }
        }

        // Update user's avatar
        user.avatar = publicUrl;
        await user.save();

        res.status(200).json({
            message: "Avatar updated successfully",
            avatar: user.avatar,
        });

    } catch (err) {
        console.error("Error updating avatar:", err);
        res.status(500).json({ error: "Server error: failed to update avatar" });
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
            isVerfied: true,
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
