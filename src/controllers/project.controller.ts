import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/project.model";
import { ProjectMember } from "../models/project-member.router";
import { ProjectCarbon } from "../models/project-carbon.model";
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

      const updatedProject = await ProjectCarbon.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        },
      );

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

  public async updateDocumentsStatus(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { projectId, documentId } = req.params;
      const { status } = req.query;
      if (typeof status !== "string") {
        res.status(400).json({ error: "`status` phải là kiểu chuỗi (string)" });
        return;
      }

      // Optional: validate giá trị status nếu cần
      const validStatuses = ["rejected", "approved", "pending"];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          error: `Giá trị 'status' không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(", ")}`,
        });
        return;
      }
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, "documents._id": documentId },
        { $set: { "documents.$.status": status } },
        { new: true },
      );

      if (!updatedProject) {
        res
          .status(404)
          .json({ error: "Không tìm thấy project hoặc document." });
        return;
      }
      res.status(200).json(updatedProject);
      return;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái tài liệu:", error);
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi cập nhật trạng thái", error });
      return;
    }
  }

  public async updateDocuments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { documents } = req.body;

      if (!Array.isArray(documents)) {
        res.status(400).json({ error: "documents phải là một mảng" });
        return;
      }
      const product = await Project.findByIdAndUpdate(
        id,
        { documents },
        { new: true, runValidators: true },
      );
      if (!product) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra!", error });
    }
  }
  public async updateActivities(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { activities } = req.body;

      if (!Array.isArray(activities)) {
        res.status(400).json({ error: "activity phải là một mảng" });
        return;
      }
      const product = await Project.findByIdAndUpdate(
        id,
        { activities },
        { new: true, runValidators: true },
      );
      if (!product) {
        res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra!", error });
    }
  }
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await ProjectCarbon.find().populate("userId").lean();
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
      const project = await ProjectCarbon.findById(id).populate("userId");
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project", error: error });
    }
  }
  async getUserProfileProject(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const projects = await ProjectCarbon.find({ userId });
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err });
    }
  }
}
export default new ProjectController();
