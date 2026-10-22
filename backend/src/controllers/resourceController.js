import mongoose from "mongoose";

export function createResourceController(Model, resourceName, populate = []) {
  const populatePaths = Array.isArray(populate) ? populate : [populate];

  function withPopulate(query) {
    return populatePaths.reduce((result, path) => path ? result.populate(path) : result, query);
  }

  const validId = (id) => mongoose.isValidObjectId(id);

  return {
    async list(req, res) {
      try {
        const items = await withPopulate(Model.find().sort({ createdAt: -1 }));
        return res.status(200).json({ success: true, count: items.length, data: items });
      } catch (error) {
        return res.status(500).json({ success: false, message: `Failed to fetch ${resourceName}`, error: error.message });
      }
    },

    async getById(req, res) {
      if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid resource ID" });
      try {
        const item = await withPopulate(Model.findById(req.params.id));
        if (!item) return res.status(404).json({ success: false, message: `${resourceName} not found` });
        return res.status(200).json({ success: true, data: item });
      } catch (error) {
        return res.status(500).json({ success: false, message: `Failed to fetch ${resourceName}`, error: error.message });
      }
    },

    async create(req, res) {
      try {
        const item = await Model.create(req.body);
        const result = await withPopulate(Model.findById(item._id));
        return res.status(201).json({ success: true, message: `${resourceName} created successfully`, data: result });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error?.code === 11000 ? `${resourceName} already exists with one of these unique fields` : `Failed to create ${resourceName}`,
          error: error.message
        });
      }
    },

    async update(req, res) {
      if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid resource ID" });
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ success: false, message: `${resourceName} not found` });
        const result = await withPopulate(Model.findById(item._id));
        return res.status(200).json({ success: true, message: `${resourceName} updated successfully`, data: result });
      } catch (error) {
        return res.status(400).json({ success: false, message: `Failed to update ${resourceName}`, error: error.message });
      }
    },

    async remove(req, res) {
      if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid resource ID" });
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: `${resourceName} not found` });
        return res.status(200).json({ success: true, message: `${resourceName} deleted successfully` });
      } catch (error) {
        return res.status(500).json({ success: false, message: `Failed to delete ${resourceName}`, error: error.message });
      }
    }
  };
}
