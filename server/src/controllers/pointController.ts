import {Request, Response} from 'express';
import knex from '../database/conection';

class PointsController {
    async index(request: Request, response: Response) {
        const {city, uf, items} = request.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('item_points', 'points.id', '=', 'item_points.point_id')
            .whereIn('item_points.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.20:3333/uploads/${point.image}`,
            };
        });

        return response.json(serializedPoints);
    };
    
    async show(request: Request, response: Response) {
        const id = request.params.id;
        const point = await knex('points').where('id', id).first();

        if(!point) {
            return response.status(400).json({message: 'Point not found.'});
        };
        
        const items = await knex('items')
        .join('item_points', 'items.id', '=', 'item_points.item_id')
        .where('item_points.point_id', id)
        .select('items.title');

        const serializedPoints = {
            ...point,
            image_url: `http://192.168.0.20:3333/uploads/${point.image}`,
        };

        return response.json({serializedPoints, items});
    };

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            longitude,
            latitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();
    
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            longitude,
            latitude,
            city,
            uf
        };

        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items.split(',').map((item: string) => Number(item.trim())).map((item_id: Number) => {
            return {
                item_id,
                point_id
            };
        });
    
        await trx('item_points').insert(pointItems);
    
        await trx.commit();

        return response.json({
            id: point_id,
            ...point,
            ...pointItems
        });
    };
};

export default PointsController;