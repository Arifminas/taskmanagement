const express = require('express');
const router = express.Router();
const assetController = require('../../controllers/assetController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

router.use(auth);

// Only admin can manage assets
router.use(role('admin'));

router.get('/', assetController.getAssets);
router.post('/', assetController.createAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
