// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportUnhandledError from '../../../app/middleware/unhandledError';

declare module 'egg' {
  interface IMiddleware {
    unhandledError: typeof ExportUnhandledError;
  }
}
