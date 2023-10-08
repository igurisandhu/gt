declare namespace Express {
  interface Request {
    agent: IAgentProfileWithoutPassword;
    owner: IOwnerProfileWithoutPassword;
    company: ICompany;
    manager: IManagerProfile;
    team: ITeamProfile;
  }
}
