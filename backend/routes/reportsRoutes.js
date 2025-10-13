import express  from 'express'
import { getCombinedReport } from '../controllers/reportsController.js'

const router = express.Router()

router.get('/combined', getCombinedReport)

export default router