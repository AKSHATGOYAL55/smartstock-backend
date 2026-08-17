import { AccessTokenPayload } from '../common/utils/jwt';

// This "declaration merging" tells TypeScript that Express's Request
// type now has an optional `user` property, everywhere in the project.
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}