import { Request, Response } from "express";
import AgentModel from "../../databases/mongo/models/agent";
import JobModel from "../../databases/mongo/models/job";
import responses from "../../utilities/responses";

const getMetrics = async (req: Request, res: Response) => {
  try {
    const metrics: object = {
      agents: {
        total_agents: await AgentModel.count(),
        active_agents: await AgentModel.count({ isActive: true }),
        inactive_agents: await AgentModel.count({ isActive: false }),
      },

      jobs: {
        total_jobs: await JobModel.count(),
        unassigned_jobs: await JobModel.count(),
        assigned_jobs: await AgentModel.count({ isActive: true }),
        completed_jobs: await AgentModel.count({ isActive: true }),
      },

      managers: {
        total_managers: await JobModel.count(),
        active_managers: await JobModel.count(),
        inactive_managers: await AgentModel.count({ isActive: true }),
      },
    };

    return responses.success(req, res, metrics);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const commonController = {
  getMetrics,
};

export default commonController;
