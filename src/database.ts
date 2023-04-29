import { type Connection, type EntityManager, type IDatabaseDriver, MikroORM, type Options, Configuration } from '@mikro-orm/core'

import { NodeEnv } from './enumerables/node-env.enum'
import { Task } from './entities/task.entity'

const {
  DATABASE_DRIVER = 'sqlite',
  DATABASE_URI = 'data.db',
  NODE_ENV = NodeEnv.DEVELOPMENT
} = process.env

export class Database {
  private readonly config: Options = {
    type: DATABASE_DRIVER as any,
    dbName: DATABASE_URI,
    entities: [Task],
    debug: NODE_ENV === NodeEnv.DEVELOPMENT
  }

  private orm!: MikroORM

  public get em (): EntityManager<IDatabaseDriver<Connection>> {
    return this.orm.em.fork()
  }

  public async init (): Promise<void> {
    this.orm = await MikroORM.init(this.config)

    await this.orm
      .getSchemaGenerator()
      .updateSchema()
  }

  public async isConnected (): Promise<boolean> {
    return await this.orm.isConnected()
  }

  public async close (): Promise<void> {
    await this.orm.close()
  }
}

export const database = new Database()
