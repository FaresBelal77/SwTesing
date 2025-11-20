/******** CONTROLLERS: /controllers/menuController.js (imperative logic, fixed syntax) ********/
const menuController = {
    // Create menu item (admin only)
    async addMenuItem(req, res) {
      try {
        const { name, description, price, category, available } = req.body;
        if (!name || typeof price === 'undefined' || !category) {
          return res.status(400).json({ message: 'name, price and category are required' });
        }
        const exists = await MenuItem.findOne({ name: name.trim() });
        if (exists) return res.status(409).json({ message: 'Menu item with this name already exists' });
        const item = new MenuItem({ name: name.trim(), description, price, category, available });
        await item.save();
        return res.status(201).json(item);
      } catch (err) {
        console.error('addMenuItem error', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
      }
    },
  
    // Edit menu item (admin only)
    async editMenuItem(req, res) {
      try {
        const { id } = req.params;
        const updates = req.body;
  
        if (updates.name && typeof updates.name !== 'string') return res.status(400).json({ message: 'Invalid name' });
        if (updates.price && typeof updates.price !== 'number') return res.status(400).json({ message: 'Invalid price' });
  
        const item = await MenuItem.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ message: 'Menu item not found' });
        return res.json(item);
      } catch (err) {
        console.error('editMenuItem error', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
      }
    },
  
    // Delete menu item (admin only)
    async deleteMenuItem(req, res) {
      try {
        const { id } = req.params;
        const item = await MenuItem.findByIdAndDelete(id);
        if (!item) return res.status(404).json({ message: 'Menu item not found' });
        return res.json({ message: 'Deleted', id: item._id });
      } catch (err) {
        console.error('deleteMenuItem error', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
      }
    },
  
    // List items (public, declarative filtering via query)
    async listMenuItems(req, res) {
      try {
        const { category, available, search, limit = 50, skip = 0 } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (typeof available !== 'undefined') filter.available = available === 'true';
        if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
  
        const items = await MenuItem.find(filter)
          .sort({ category: 1, name: 1 })
          .limit(Math.min(parseInt(limit, 10) || 50, 200))
          .skip(parseInt(skip, 10) || 0);
  
        return res.json(items);
      } catch (err) {
        console.error('listMenuItems error', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
      }
    }
  };
  module.exports = menuController;
