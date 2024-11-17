import { Document, Model } from "mongoose";

export interface IAggregateOptions {
  page?: number;
  perPage?: number;
  projectFields?: Record<string, 1>;
  sort?: Record<string, number>;
  unwind?: string[];
  lookups?: {
    from: string; // Name of the collection you want to join with
    localField: string;
    foreignField: string;
    as: string;
  }[];
}

interface IAggregateResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  perPage: number;
}

async function aggregateWithPaginationAndPopulate<T extends Document>(
  model: Model<T>,
  match: Record<string, any>,
  options: IAggregateOptions,
): Promise<IAggregateResult<T>> {
  const {
    page = 1,
    perPage = 10,
    projectFields,
    sort,
    lookups,
    unwind,
  } = options;

  const skip = (page - 1) * perPage;

  // Define the aggregation pipeline for populating fields
  let populatePipeline: any[] = [
    { $match: match },
    { $skip: skip },
    { $limit: perPage },
  ];

  if (sort) {
    populatePipeline = [...populatePipeline, { $sort: sort }];
  }

  if (lookups && lookups.length > 0) {
    lookups.map((lookup) => {
      populatePipeline = [...populatePipeline, { $lookup: lookup }];
    });
  }

  if (unwind) {
    unwind.map((item: string) => {
      populatePipeline = [...populatePipeline, { $unwind: `$${item}` }];
    });
  }

  // Define the aggregation pipeline for calculating the total count
  const countPipeline: any[] = [...[{ $match: match }], { $count: "count" }];

  let pipeline: any[] = [
    {
      $facet: {
        data: populatePipeline,
        count: countPipeline,
      },
    },
  ];

  if (projectFields) {
    pipeline = [...pipeline, { $project: projectFields }];
  }

  // Execute both pipelines using $facet
  const [result] = await model.aggregate(pipeline);

  const { data, count } = result;

  const totalCount = count.length > 0 ? count[0].count : 0;

  return {
    data,
    total: totalCount,
    currentPage: page,
    perPage: perPage,
  };
}

export default aggregateWithPaginationAndPopulate;
