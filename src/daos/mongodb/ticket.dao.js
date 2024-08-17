import { ticketModel } from './models/ticket.model.js';

export const createTicket = async (ticketData) => {
  try {
    const newTicket = await ticketModel.create(ticketData);
    return newTicket;
  } catch (error) {
    console.error("Error al crear el ticket:", error);
    throw new Error("Error al crear el ticket");
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const ticket = await ticketModel.findById(ticketId).populate('purchaser');
    if (!ticket) {
      throw new Error("Ticket no encontrado");
    }
    return ticket;
  } catch (error) {
    console.error("Error al obtener el ticket por ID:", error);
    throw new Error("Error al obtener el ticket");
  }
};

export const getAllTickets = async () => {
  try {
    const tickets = await ticketModel.find().populate('purchaser');
    return tickets;
  } catch (error) {
    console.error("Error al obtener todos los tickets:", error);
    throw new Error("Error al obtener los tickets");
  }
};
