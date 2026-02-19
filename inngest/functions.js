import { inngest } from "./client";
import connectDB from "../lib/mongodb";
import User from "../lib/models/User";

export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-create" },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        await connectDB();
        const { data } = event;
        await User.create({
            _id: data.id,
            name: data.first_name + " " + data.last_name,
            email: data.email_addresses[0].email_address,
            image: data.image_url,
        });
    }
)

export const syncUserUpdate = inngest.createFunction(
    { id: "sync-user-update" },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        await connectDB();
        const { data } = event;
        await User.findByIdAndUpdate(data.id, {
            name: data.first_name + " " + data.last_name,
            email: data.email_addresses[0].email_address,
            image: data.image_url,
        });
    }
)

export const syncUserDelete = inngest.createFunction(
    { id: "sync-user-delete" },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        await connectDB();
        const { data } = event;
        await User.findByIdAndDelete(data.id);
    }
)