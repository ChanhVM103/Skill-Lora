import { Users as _Users } from './users';
import { CvAnalysis as _CvAnalysis } from './cv_analysis';

export namespace PrismaModel {
  export class Users extends _Users {}
  export class CvAnalysis extends _CvAnalysis {}

  export const extraModels = [Users, CvAnalysis];
}
