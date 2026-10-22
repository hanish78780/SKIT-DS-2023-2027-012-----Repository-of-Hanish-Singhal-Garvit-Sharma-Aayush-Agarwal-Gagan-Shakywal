import Driver from "../models/Driver.js";
import { createResourceController } from "./resourceController.js";

const controller = createResourceController(Driver, "driver", ["bus"]);

export const listDrivers = controller.list;
export const getDriverById = controller.getById;
export const createDriver = controller.create;
export const updateDriver = controller.update;
export const deleteDriver = controller.remove;
