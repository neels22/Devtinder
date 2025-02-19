const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionrequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

// Function to check if a request already exists
const requestExists = async (fromUserId, toUserId) => {
    return await ConnectionRequest.findOne({ fromUserId, toUserId });
};

// Function to validate if the request exists and belongs to the recipient
const validateRequestOwnership = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const request = await ConnectionRequest.findById(requestId);
        
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.toUserId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        req.request = request;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// ✅ Send Connection Request (Interested)
requestRouter.post("/request/send/interested/:userId", userAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user._id.toString() === userId) {
            return res.status(400).json({ message: "You cannot send a request to yourself" });
        }

        const userExists = await User.findById(userId);
        if (!userExists) return res.status(404).json({ message: "User not found" });

        if (await requestExists(req.user._id, userId)) {
            return res.status(400).json({ message: "Request already sent" });
        }

        const request = new ConnectionRequest({
            fromUserId: req.user._id,
            toUserId: userId,
            status: "interested",
        });

        await request.save();
        res.status(201).json({ message: "Connection request sent", request });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// ✅ Send Connection Request (Ignored)
requestRouter.post("/request/send/ignored/:userId", userAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user._id.toString() === userId) {
            return res.status(400).json({ message: "You cannot ignore yourself" });
        }

        const userExists = await User.findById(userId);
        if (!userExists) return res.status(404).json({ message: "User not found" });

        if (await requestExists(req.user._id, userId)) {
            return res.status(400).json({ message: "Request already sent" });
        }

        const request = new ConnectionRequest({
            fromUserId: req.user._id,
            toUserId: userId,
            status: "ignore",
        });

        await request.save();
        res.status(201).json({ message: "Request ignored", request });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// ✅ Review Connection Request (Accepted)
requestRouter.post("/request/review/accepted/:requestId", userAuth, validateRequestOwnership, async (req, res) => {
    try {
        if (req.request.status !== "interested") {
            return res.status(400).json({ message: "Only 'interested' requests can be accepted" });
        }

        req.request.status = "accepted";
        await req.request.save();
        res.json({ message: "Request accepted", request: req.request });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// ✅ Review Connection Request (Rejected)
requestRouter.post("/request/review/rejected/:requestId", userAuth, validateRequestOwnership, async (req, res) => {
    try {
        if (req.request.status !== "interested") {
            return res.status(400).json({ message: "Only 'interested' requests can be rejected" });
        }

        req.request.status = "rejected";
        await req.request.save();
        res.json({ message: "Request rejected", request: req.request });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

module.exports = requestRouter;
