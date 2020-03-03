import {INestApplication, INestApplicationContext} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {useContainer} from 'class-validator';
import cors from 'cors';
import helmet from 'helmet';
import qs from 'qs-middleware';
import {config} from '../config';
import {AppLogger} from './app.logger';
import {AppModule} from './app.module';
import {HttpExceptionFilter} from './shared/filters';

export class AppMain {
	private app!: INestApplication;
	private logger = new AppLogger();

	async bootstrap(): Promise<void> {
		await this.createServer();
		// this.createMicroservices();
		// await this.startMicroservices();
		return this.startServer();
	}

	async shutdown(): Promise<void> {
		await this.app.close();
	}

	public getContext(): Promise<INestApplicationContext> {
		return NestFactory.createApplicationContext(AppModule);
	}

	private async createServer(): Promise<void> {
		this.app = await NestFactory.create(AppModule, {
			logger: new AppLogger()
		});
		useContainer(this.app.select(AppModule), {fallbackOnErrors: true});
		this.app.use(cors());
		this.app.use(qs());
		this.app.useGlobalFilters(new HttpExceptionFilter());
		if (config.isProduction) {
			this.app.use(helmet());
		}
	}

	// private createMicroservices(): void {
	// 	this.microservice = this.app.connectMicroservice(config.microservice);
	// }

	// private startMicroservices(): Promise<void> {
	// 	return this.app.startAllMicroservicesAsync();
	// }

	private async startServer(): Promise<void> {
		await this.app.listen(config.port, config.host);
		this.logger.log(`Server is listening http://${config.host}:${config.port}`);
	}
}