import { TReqUser, TUser } from '@shared/types';

declare namespace Express {
  export interface Request {
    user?: TReqUser | TUser;
  }
}
