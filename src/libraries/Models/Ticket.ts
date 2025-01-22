import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITicket extends Document {
    messageId: string;
    parentId: string;
    ticketId: string;
    staffRoleId: string;
}

const TicketSchema: Schema = new Schema({
    messageId: {
        type: String,
        required: true,
    },
    parentId: {
        type: String,
        required: true,
    },
    ticketId: {
        type: String,
        required: true,
    },
    staffRoleId: {
        type: String,
        required: true,
    },
});

const Ticket: Model<ITicket> =
    mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
