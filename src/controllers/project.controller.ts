import { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/project.model";
class ProjectController {
  async createProject(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        status,
        registrationDate,
        startDate,
        endDate,
        carbonCredits,
        carbonCreditsTotal,
        carbonCreditsClaimed,
        type,
        location,
        coordinates,
        area,
        participants,
        progress,
        documents,
        activities,
        userId,
      } = req.body;
      const newProject = new Project({
        name,
        description,
        status,
        registrationDate,
        startDate,
        endDate,
        carbonCredits,
        carbonCreditsTotal,
        carbonCreditsClaimed,
        type,
        location,
        coordinates,
        area,
        participants,
        progress,
        documents,
        activities,
        userId,
      });
      await newProject.save();
      res
        .status(201)
        .json({ message: "Project created successfully", project: newProject });
    } catch (error) {
      res.status(500).json({ message: "Error creating project", error: error });
    }
  }
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await Project.find().populate("userId").lean();
      res.status(200).json(projects);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching projects", error: error });
    }
  }

  async getProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid project ID" });
      }
      const project = await Project.findById(id).populate("userId"); // Nếu liên kết với User model
      if (!project) {
        res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project", error: error });
    }
  }
  async getUserProfileProject(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      console.log(req.params);
      const projects = await Project.find({ userId });
      const activeCount = projects.filter((p) => p.status === "active").length;
      res.json({
        total: projects.length,
        active: activeCount,
        projects,
      });
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err });
    }
  }
}
export default new ProjectController();
