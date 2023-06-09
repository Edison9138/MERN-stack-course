import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnAuthenticatedError,
  NotFoundError,
} from "../errors/index.js";
import Job from "../models/Job.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const getAllJobs = async (req, res) => {
  // for query parameter
  const { status, jobType, sort, search } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };

  // add stuff based on condition
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  // if "search" is empty, there would be no "search query parameter at all"
  if (search) {
    // $options: "i" means case-insensitive
    queryObject.position = { $regex: search, $options: "i" };
  }

  // NO AWAIT: only get the query
  let result = Job.find(queryObject);

  // chain sort conditions
  if (sort == "latest") {
    // "-" in front of createdAt means sort in the descending order
    result = result.sort("-createdAt");
  }
  if (sort == "oldest") {
    result = result.sort("createdAt");
  }
  if (sort == "a-z") {
    result = result.sort("position");
  }
  if (sort == "z-a") {
    result = result.sort("-position");
  }

  // convert string to number
  const page = Number(req.query.page) || 1;
  // limit the number of jobs we get in the response
  const limit = Number(req.query.limit) || 10;
  // skip the number of jobs  we get in the response
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  // if 75 jobs
  // 10 10 10 10 10 10 10 5

  const jobs = await result;

  // only get the number of total jobs of that specific query
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

// if use "await", get the result immediately
// but if no "await", get back the query so we can chain it
const updateJob = async (req, res) => {
  //"{ id: jobId } = req.params": extract the value of the id parameter and assign it to the variable jobId. It allows you to access dynamic parts of the URL, such as /jobs/:id, where id is a parameter representing the job ID.
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }
  const job = await Job.findOne({ _id: jobId });

  // find a job document in the database using the Job model and the provided jobId
  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  // check permissions
  // updates the job document in the database
  // "req.body" object contains the updated values for company and position
  // "new: true" tells Mongoose to return the modified document instead of the original
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    // When runValidators is set to true, the update operation will trigger validation checks based on the schema's defined validators, such as required fields, data types, or custom validation functions. If any validation error occurs, the update operation will be aborted, and an error will be returned.
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ updatedJob });

  // Another way to update, this approach will trigger hooks, but the above "findOneAndUpdate" one won't
  // but the downside of this approach is we need to pull out the properties one by one to update
  // job.position = position;
  // job.company = company;
  // await job.save();
  // res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });

  // find a job document in the database using the Job model and the provided jobId
  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await Job.deleteOne({ _id: jobId });
  // provided by tutorial but wasn't working
  //await job.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Job removed" });
};

const showStats = async (req, res) => {
  // aggregation pipeline is like a series of steps
  let stats = await Job.aggregate([
    // each step is like an object
    // get the jobs created by a certain user
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    // group jobs by status
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // return stats as objects
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  // prevent breaking in scenarios when not all status exist
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      // group by both year and month
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    // sort by year, then month
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    // only want the six latest months
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1) // moment accepts months as 0-11
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
