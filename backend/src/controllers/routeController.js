import Route from "../models/Route.js";
import { createResourceController } from "./resourceController.js";

const controller = createResourceController(Route, "route", []);

export const listRoutes = controller.list;
export const getRouteById = controller.getById;
export const createRoute = controller.create;
export const updateRoute = controller.update;
export const deleteRoute = controller.remove;
