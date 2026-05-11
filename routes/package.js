const express = require('express')
const router = express.Router()
const PackageController = require('../controller/package')
const { isAuth } = require('../middleware/isAuth')
const { isAdmin } = require('../middleware/isAdmin')
const upload = require('../middleware/multer')

router.get('/packages', PackageController.getAllPackages)

router.get('/package/:id', PackageController.getPackageById)

router.get('/packages/destination/:destinationId', PackageController.getPackagesByDestination)

router.post('/add-package', isAuth, isAdmin, upload.single('image'), PackageController.AddPackage)

router.put('/update-package/:id', isAuth, isAdmin, upload.single('image'), PackageController.updatePackage)

router.delete('/delete-package/:id', isAuth, isAdmin, PackageController.deletePackage)

module.exports = router;