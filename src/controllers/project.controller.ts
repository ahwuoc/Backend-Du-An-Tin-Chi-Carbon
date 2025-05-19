import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/project.model";
import { ProjectMember } from "../models/project-member.router";
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
  async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedProject) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.status(200).json({
        message: "Project updated successfully",
        project: updatedProject,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating project", error });
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
      if (!id) {
        res.status(400).json({ message: "Invalid project ID" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid project ID" });
        return;
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
      const memberships = await ProjectMember.find({ userId });
      const projectIds = memberships.map((m) => m.projectId);
      const projects = await Project.find({ _id: { $in: projectIds } });
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err });
    }
  }
}
export default new ProjectController();
