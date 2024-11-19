// import { IAgent } from '../../types/controllers/agent';
// import { IOwner } from '../../types/controllers/owner';
// import { ICompany } from '../../types/controllers/company';
// import { IManager } from '../../types/controllers/manager';
// import { ITeam } from '../../types/controllers/team';

declare global {
  namespace Express {
    // tslint:disable-next-line:interface-name
    interface Request {
      agent?: any;
      owner?: any;
      company?: any;
      manager?: any;
      team?: any;
    }
  }
}

export {};
