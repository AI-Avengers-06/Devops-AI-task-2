import { Router } from 'express';
import {
  getAlertConfigs,
  createAlertConfig,
  updateAlertConfig,
  deleteAlertConfig
} from '../controllers/alert.controller';

const router = Router();

router.get('/', getAlertConfigs);
router.post('/', createAlertConfig);
router.put('/:id', updateAlertConfig);
router.delete('/:id', deleteAlertConfig);

export { router };
