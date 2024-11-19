import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { IJob, ITaskProfile } from "../../types/controllers/task";
import TaskModel from "../../databases/mongo/models/task";
import { ObjectId } from "mongoose";

import { IManagerProfile } from "../../types/controllers/manager";
import { ICompanyProfile } from "../../types/controllers/company";
import JobModel from "../../databases/mongo/models/job";

const addJob = async (req: Request, res: Response) => {
  try {
    const company: ICompanyProfile = req.company;
    const manager: IManagerProfile = req.manager;

    const jobData = req.body;
    const tasks: ITaskProfile[] = jobData.task_id;

    delete jobData.tasks;

    jobData.order_id = (await JobModel.countDocuments()) + 10001;
    if (company) {
      jobData.company_id = company._id;
      jobData.owner_id = company._id;
    }

    if (manager) {
      jobData.company_id = manager.company_id;
      jobData.owner_id = manager.owner_id;
      jobData.manager_id = manager._id;
    }

    // Create tasks and store the IDs
    const taskResults = await Promise.all(
      tasks.map((task) => TaskModel.create(task)),
    );
    const taskIds = taskResults.map((task) => task._id);

    try {
      // Create the job
      const job = await JobModel.create({ ...jobData, task_id: [...taskIds] });

      return responses.success(req, res, { ...job, tasks: taskResults });
    } catch (jobError) {
      // If creating the job fails, delete the created tasks
      console.log(jobError);
      await TaskModel.deleteMany({ _id: { $in: taskIds } });

      return responses.serverError(req, res, {});
    }
  } catch (error) {
    console.log(error);
    return responses.serverError(req, res, {});
  }
};

const updateJob = async (req: Request, res: Response) => {
  try {
    const jobData = req.body;
    const job_id = req.params._id;
    const tasks: ITaskProfile[] = jobData.task_id;

    delete jobData.tasks;

    const job = await JobModel.findById(job_id).lean();
    if (!job) {
      return responses.notFound(req, res, {}, "Job");
    }
    await TaskModel.deleteMany({ _id: { $in: job.task_id } });

    // Create tasks and store the IDs
    const taskResults = await Promise.all(
      tasks.map((task) => TaskModel.create(task)),
    );
    const taskIds = taskResults.map((task) => task._id);

    try {
      // Update the job
      await JobModel.updateOne(
        { _id: jobData._id },
        { ...jobData, task_id: [...taskIds] },
      );

      return responses.success(req, res, { ...job, tasks: taskResults });
    } catch (jobError) {
      // If updating the job fails, delete the created tasks
      console.log(jobError);
      await TaskModel.deleteMany({ _id: { $in: taskIds } });

      return responses.serverError(req, res, {});
    }
  } catch (error) {
    console.log(error);
    return responses.serverError(req, res, {});
  }
};

const getJob = async (req: Request, res: Response) => {
  try {
    const company: ICompanyProfile = req.company;

    const { _id }: { _id?: string } = req.query as { _id?: string };

    let data: IJob[] | IJob = [];
    let total = 0;

    if (_id) {
      const job = await JobModel.findOne({
        _id: _id,
        company_id: company._id,
      })
        .populate("task_id")
        .lean();

      if (!job) {
        return responses.notFound(req, res, {}, "Job");
      }

      data = job;
      total = 1;
    } else {
      const {
        limit = "10",
        page = "1",
        isActive,
        team_id,
        agent_id,
      }: {
        limit?: string;
        page?: string;
        name?: string;
        sort?: string;
        isActive?: string;
        team_id?: string;
        agent_id?: string;
      } = req.query;

      const searchQuery: {
        company_id: ObjectId;
        isActive?: boolean;
        team_id?: string;
        agent_id?: string;
      } = {
        company_id: company._id,
      };

      if (isActive) {
        searchQuery.isActive = isActive == "true" ? true : false;
      }

      if (agent_id) {
        searchQuery.agent_id = agent_id;
      }

      if (team_id) {
        searchQuery.team_id = team_id;
      }

      const count = await JobModel.countDocuments(searchQuery);

      const skip = (Number(page) - 1) * Number(limit);

      const jobs = await JobModel.find(searchQuery)
        .skip(skip)
        .limit(Number(limit))
        .populate("task_id")
        .lean();
      data = jobs;
      total = count;
    }

    return responses.success(req, res, data, total);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const deleteJob = async (req: Request, res: Response) => {
  try {
    const _id = req.params._id;

    await JobModel.deleteOne({ _id: _id });
    return responses.success(req, res, {});
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const assignAgent = async (req: Request, res: Response) => {
  try {
    const company: ICompanyProfile = req.company;

    const { job_id, agent_id } = req.body;

    const job = await JobModel.findOne({
      _id: job_id,
      company_id: company._id,
    });

    if (!job) {
      return responses.notFound(req, res, {}, "Job");
    }

    job.agent_id = agent_id;

    await job.save();

    return responses.success(req, res, {});
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const taskController = {
  addJob,
  updateJob,
  getJob,
  deleteJob,
  assignAgent,
};

export default taskController;
