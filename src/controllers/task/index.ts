import { IOwnerProfile } from "../../types/controllers/owner";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { ITask, ITaskProfile } from "../../types/controllers/task";
import TaskModel from "../../databases/mongo/models/task";
import mongoose, { ObjectId } from "mongoose";

import { IManagerProfile } from "../../types/controllers/manager";
import { ICompanyProfile } from "../../types/controllers/company";
import aggregateWithPaginationAndPopulate, {
  IAggregateOptions,
} from "../../databases/mongo/coommon";

const addTask = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const company: ICompanyProfile = req.company;
    const manager: IManagerProfile = req.manager;

    let taskData = req.body;

    manager ? (taskData.manager_id = manager._id) : false;

    let task: ITaskProfile | null;

    if (taskData._id) {
      task = await TaskModel.findByIdAndUpdate(
        taskData._id,
        { ...taskData, owner_id: owner._id, company_id: company._id },
        { new: true },
      ).lean();
    } else {
      task = (
        await TaskModel.create({
          ...taskData,
          owner_id: owner._id,
          company_id: company._id,
        })
      ).toObject();
    }

    if (!task) {
      return responses.serverError(req, res, {});
    }

    return responses.success(req, res, task);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const getTask = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const manager: IManagerProfile = req.manager;
    const company: ICompanyProfile = req.company;

    const { task_id }: { task_id?: string } = req.query;

    let data: [] | {} = [];
    let total: number = 0;

    if (task_id) {
      let _id;

      try {
        _id = new mongoose.Types.ObjectId(task_id);
      } catch (error) {
        return responses.requestDataValidatorError(
          req,
          res,
          {},
          req.t("INVALID", { module: "Task Id" }),
        );
      }

      let task: ITaskProfile | null = null;

      if (owner) {
        task = await TaskModel.findOne({
          _id: _id,
          owner_id: owner._id,
          company_id: company._id,
        }).lean();
      }

      if (manager) {
        task = await TaskModel.findOne({
          task_id: _id,
          manager_id: manager._id,
          company_id: company._id,
        });
      }

      if (!task) {
        return responses.notFound(req, res, {}, "Task");
      }

      data = task;
      total = 1;
    } else {
      const {
        limit = "10",
        page = "1",
        name,
        sort,
        isActive,
      }: {
        limit?: string;
        page?: string;
        name?: string;
        sort?: string;
        isActive?: string;
      } = req.query;

      let searchQuery: {
        name?: {
          $regex: string;
          $options?: string;
        };
        owner_id?: ObjectId;
        manager_id?: ObjectId;
        company_id: ObjectId;
        isActive?: boolean;
      } = {
        company_id: company._id,
      };

      if (manager && manager._id) {
        searchQuery = {
          ...searchQuery,
          manager_id: manager._id,
        };
      }

      if (isActive) {
        searchQuery.isActive = isActive == "true" ? true : false;
      }

      if (name) {
        searchQuery = {
          ...searchQuery,
          name: { $regex: name, $options: "i" },
        };
      }

      let AggregateOptions: IAggregateOptions = {
        page: Number(page),
        perPage: Number(limit),
      };

      if (sort) {
        AggregateOptions.sort = { name: Number(sort) };
      }

      if (owner && !manager) {
        searchQuery.owner_id = owner._id;
        const result = await aggregateWithPaginationAndPopulate(
          TaskModel,
          searchQuery,
          AggregateOptions,
        );
        data = result.data;
        total = result.total;
      } else if (manager) {
        searchQuery.manager_id = manager._id;
        AggregateOptions.lookups = [
          {
            from: "tasks",
            localField: "task_id",
            foreignField: "_id",
            as: "task",
          },
        ];
        const result = await aggregateWithPaginationAndPopulate(
          TaskModel,
          searchQuery,
          AggregateOptions,
        );
        data = result.data.map((managerTask: any) => managerTask?.task[0]);
        total = result.total;
      }
    }

    return responses.success(req, res, data, total);
  } catch (error) {
    console.log(error);
    return responses.serverError(req, res, {});
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const _id = req.params._id;

    await TaskModel.deleteOne({ _id: _id });
    return responses.success(req, res, {});
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const taskController = {
  addTask,
  getTask,
  deleteTask,
};

export default taskController;
