import express from "express";
const router = express.Router();

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from "../controllers/jobsController.js";

import testUser from "../middleware/testUser.js";

// `router.route("/")`: any HTTP request made to the root URL will be handled by this route
// `.post(createJob)` : when a POST request is made to the root URL, it will be processed by the createJob function
// `.get(getAllJobs)`: when a GET request is made to the root URL, it will be processed by the getAllJobs function
router.route("/").post(testUser, createJob).get(getAllJobs);
// remember about :id
router.route("/stats").get(showStats);
router.route("/:id").delete(testUser, deleteJob).patch(testUser, updateJob);

export default router;
