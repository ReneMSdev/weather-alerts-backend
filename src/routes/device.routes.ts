// src/routes/device.routes.ts
// Device routes for registering and managing devices
import { Router } from 'express'
import { registerDevice, addDeviceLocation } from '../controllers/device.controller'

const router = Router()

// Get or create a device
router.post('/', registerDevice)

// Add a location to a device
router.post('/:deviceId/locations', addDeviceLocation)

export default router
