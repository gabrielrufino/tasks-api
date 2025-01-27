import type { Request, Response } from 'express';

import { database } from '../config/database';
import { Task } from '../entities/task.entity';
import { NotFound } from '../exceptions/not-found.exception';

export class TasksController {
  public async findMany(request: Request, response: Response): Promise<Response> {
    const [data, total] = await database.em.findAndCount(Task, { ownerId: request.user.id });
    return response.json({ data, total });
  }

  public async createOne(request: Request, response: Response): Promise<Response> {
    const { title, description } = request.body;
    const { id: ownerId } = request.user;

    const task = new Task({
      title,
      description,
      ownerId,
    });

    await database.em.persistAndFlush(task);

    return response.status(201).json(task);
  }

  public async updateOne(request: Request, response: Response): Promise<Response> {
    const task = await database.em.findOne(Task, {
      id: Number(request.params.taskId),
      ownerId: request.user.id,
    });
    if (task === null) {
      return response.status(404).json(new NotFound());
    }

    const {
      title = task.title,
      description = task.description,
      status = task.status,
    } = request.body;

    task.title = title;
    task.description = description;
    task.status = status;

    await database.em.persistAndFlush(task);

    return response.json(task);
  }
}

export const controller = new TasksController();
