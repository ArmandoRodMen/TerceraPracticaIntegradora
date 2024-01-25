import { ticketsModel } from "./models/tickets.model.js";

class TicketsDao {
    async createTicket(ticket) {
        const response = await ticketsModel.create(ticket);
        return response;
    }
}

export const ticketsDao = new TicketsDao();