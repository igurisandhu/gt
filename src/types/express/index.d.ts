declare namespace Express {
  interface Request {
    agent: IAgentProfile;
    owner: IOwnerProfile;
    company: ICompanyProfile;
    manager: IManagerProfile;
    team: ITeamProfile;
  }
}
