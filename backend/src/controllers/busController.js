import Bus from "../models/Bus.js";
import { createResourceController } from "./resourceController.js";

const controller = createResourceController(Bus, "bus", []);

export const listBuses = controller.list;
export const getBusById = controller.getById;
export const createBus = controller.create;
export const updateBus = controller.update;
export const deleteBus = controller.remove;
