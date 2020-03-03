import {Response, Request} from 'express';
import uuid from 'uuid';
import cls from 'cls-hooked';
import {UserEntity} from '../user/entity';

export class RequestContext {

	public static nsid = uuid.v4();
	public readonly id: number;
	public request: Request;
	public response: Response;

	constructor(request: Request, response: Response) {
		this.id = Math.random();
		this.request = request;
		this.response = response;
	}

	public static currentRequestContext(): RequestContext | null {
		const session = cls.getNamespace(RequestContext.nsid);

    if (session && session.active) {
      return session.get(RequestContext.name);
    }

    return null;
	}

	public static currentRequest(): Request | null {
		const requestContext = RequestContext.currentRequestContext();

		if (requestContext) {
			return requestContext.request;
		}

		return null;
	}

	public static currentUser(): UserEntity | null {
    const requestContext = RequestContext.currentRequestContext();

		if (requestContext && (requestContext instanceof RequestContext)) {
			const user: UserEntity = requestContext.request.user;
			if (user) {
				return user;
			}
		}

		return null;
	}
}