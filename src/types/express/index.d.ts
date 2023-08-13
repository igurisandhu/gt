declare namespace Express {
  interface Request {
    agent: IAgentProfileWithoutPassword;
    owner: IOwnerProfileWithoutPassword;
    ownerCompany: IOwnerCompany;
  }
}
