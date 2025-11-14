import express from "express";
import {
    login,
    signup,
    updateEmail,
    verifyNewEmail,
    acceptTerms,
    forgotPassword,
    resetPassword,
    createStaff,
    updatePassword,
    updateUserAvatar,
    deleteStaff,
    updateUserProfile,
    googleLogin,
    verifyEmail,
    resendCode,
    updateAddress,
} from "../controllers/authController.js";
import {
    verifyToken,
    adminOnly,
    requireRole,
} from "../middleware/authMiddleware.js";
import rateLimit from "../middleware/rateLimitMiddleware.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// public routes
router.post("/signup", signup);
router.post("/login", rateLimit, login);
router.post("/google-login", rateLimit, googleLogin);
router.post("/verify", verifyEmail);
router.post("/resent-code", rateLimit, resendCode); //add rate limiting

// forgot password routes
router.post("/forgot-password", rateLimit, forgotPassword);
router.post("/reset-password", rateLimit, resetPassword);

// user routes
router.patch(
    "/:userId/profile",
    verifyToken,
    requireRole(["user"]),
    updateUserProfile
);
router.patch(
    "/:userId/avatar",
    verifyToken,
    upload.single("avatar"),
    updateUserAvatar
);
router.patch(
    "/:userId/address",
    verifyToken,
    requireRole(["user", "staff"]),
    updateAddress
);

router.patch(
    "/:userId/password",
    verifyToken,
    requireRole(["user"]),
    updatePassword
);
router.patch("/:userId/email", verifyToken, requireRole(["user"]), updateEmail);
router.post(
    "/:userId/verify-email",
    verifyToken,
    requireRole(["user"]),
    verifyNewEmail
);

router.put(
    "/:userId/accept-terms",
    verifyToken,
    requireRole(["user"]),
    acceptTerms
);

// admin only routes
router.post(
    "/create-staff",
    verifyToken,
    adminOnly,
    requireRole(["admin"]),
    createStaff
);
router.delete(
    "/delete-staff/:staffId",
    verifyToken,
    adminOnly,
    requireRole(["admin"]),
    deleteStaff
);
export default router;
