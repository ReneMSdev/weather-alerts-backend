// Device routes for registering and managing devices
import { Router } from 'express'
import { registerDevice } from '../controllers/device.controller'

const router = Router()

router.post('/', registerDevice)

export default router
