// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportPage from '../../../app/controller/page';
import ExportUser from '../../../app/controller/user';
import ExportWork from '../../../app/controller/work';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    page: ExportPage;
    user: ExportUser;
    work: ExportWork;
  }
}
