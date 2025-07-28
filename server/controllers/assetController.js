const Asset = require('../models/Asset');

// Get all assets
exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find()
      .populate('group', 'name')
      .populate('assignedTo', 'name');
    res.json({ success: true, data: assets });
  } catch (err) {
    console.error('Get assets error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create asset
exports.createAsset = async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json({ success: true, data: asset });
  } catch (err) {
    console.error('Create asset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update asset
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json({ success: true, data: asset });
  } catch (err) {
    console.error('Update asset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete asset
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json({ success: true, message: 'Asset deleted' });
  } catch (err) {
    console.error('Delete asset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
