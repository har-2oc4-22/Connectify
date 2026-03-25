import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

/**
 * Send a new message
 * @route POST /api/message/send/:receiver
 * @access Private
 */
export const sendMessage = async (req, res, next) => {
    try {
        let sender = req.userId
        let { receiver } = req.params
        let { message } = req.body

        if (!receiver) {
            const error = new Error("Receiver ID is required");
            error.statusCode = 400;
            return next(error);
        }

        // Must have either text message or an image
        if ((!message || message.trim() === '') && !req.file) {
            const error = new Error("Message content or image is required");
            error.statusCode = 400;
            return next(error);
        }

        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
            
            // If image was provided but upload failed, don't proceed to create message
            if (!image) {
                const error = new Error("Failed to upload image. Please try again.");
                error.statusCode = 500;
                return next(error);
            }
        }

        let conversation = await Conversation.findOne({
            partcipants: { $all: [sender, receiver] }
        })

        let newMessage = await Message.create({
            sender, 
            receiver, 
            message: message ? message.trim() : "", 
            image
        })

        if (!conversation) {
            conversation = await Conversation.create({
                partcipants: [sender, receiver],
                messages: [newMessage._id]
            })
        } else {
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }

        const receiverSocketId = getReceiverSocketId(receiver)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        
        return res.status(201).json(newMessage)
    
    } catch (error) {
        next(error)
    }
}

/**
 * Get all messages between current user and specified receiver
 * @route GET /api/message/:receiver
 * @access Private
 */
export const getMessages = async (req, res, next) => {
    try {
        let sender = req.userId
        let { receiver } = req.params

        if (!receiver) {
            const error = new Error("Receiver ID is required");
            error.statusCode = 400;
            return next(error);
        }

        let conversation = await Conversation.findOne({
            partcipants: { $all: [sender, receiver] }
        }).populate("messages")

        return res.status(200).json(conversation?.messages || [])
    } catch (error) {
        next(error)
    }
}