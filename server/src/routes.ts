import express, { response } from 'express';
import { celebrate, Joi} from 'celebrate';
import multer from 'multer';
import PointsController from './controllers/pointController'
import ItemsController from './controllers/itemsController'
import multerConfig from './config/multer';

const routes = express.Router();
const uploads = multer(multerConfig);

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post(
    '/points', 
    uploads.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()
        }),
    }, {
        abortEarly: false
    }), 
    pointsController.create
    );

export default routes;