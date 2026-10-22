import Trip from "../models/Trip.js";
import { createResourceController } from "./resourceController.js";

const controller = createResourceController(Trip, "trip", ["bus", "driver", "route"]);

export const listTrips = controller.list;
export const getTripById = controller.getById;
export const createTrip = controller.create;
export const updateTrip = controller.update;
export const deleteTrip = controller.remove;
