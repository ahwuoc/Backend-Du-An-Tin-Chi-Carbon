import type { Request, Response } from "express"; // Import Express types
import { ProjectCarbon } from "../models/project-carbon.model";
import { Types } from "mongoose";
import { param } from "express-validator";
import { Project } from "../models/project.model";
import { ProjectMember } from "../models/project-member.router";

interface ProjectCarbonInputData {
  name: string;
  organization?: string;
  phone: string;
  email: string;
  address?: string;
  projectType: "forest" | "rice" | "biochar";
  details?: {
    forestLocation?: string;
    forestArea?: string;
    treeSpecies?: string;
    plantingAge?: string;
    averageHeight?: string;
    averageCircumference?: string;
    previousDeforestation?: "no" | "yes" | "unknown" | "";

    riceLocation?: string;
    riceArea?: string;
    riceTerrain?: string;
    riceClimate?: string;
    riceSoilType?: string;
    riceStartDate?: string | Date | null;
    riceEndDate?: string | Date | null;

    biocharRawMaterial?: string;
    biocharCarbonContent?: string;
    biocharLandArea?: string;
    biocharApplicationMethod?: string;
  };
  additionalInfo?: string;
  landDocuments?: string[];
  kmlFile?: string | null;
  userId: Types.ObjectId | string;
}

export default class ProjectCarbonController {
  static async createProjectCarbon(req: Request, res: Response): Promise<void> {
    try {
      console.log("Full request body:", req.body);
      const { landDocuments, kmlFile, ...restBody } = req.body;
      const newProjectData: ProjectCarbonInputData = {
        ...restBody,
        landDocuments: Array.isArray(landDocuments) ? landDocuments : [],
        kmlFile: kmlFile || null,
        details: {
          ...(restBody.details || {}),
        },
        status: restBody.status || "pending",
      };

      if (typeof newProjectData.details?.riceStartDate === "string") {
        newProjectData.details.riceStartDate = new Date(
          newProjectData.details.riceStartDate,
        );
      }
      if (typeof newProjectData.details?.riceEndDate === "string") {
        newProjectData.details.riceEndDate = new Date(
          newProjectData.details.riceEndDate,
        );
      }

      const project = await ProjectCarbon.create(newProjectData);
      res.status(201).json(project);
    } catch (error: any) {
      console.error("Error creating project:", error);
      if (error.name === "ValidationError") {
        res.status(400).json({ message: error.message, errors: error.errors });
      } else {
        res
          .status(500)
          .json({ message: "Error creating project", error: error.message });
      }
    }
  }

  static async getProjectByUser(req: Request, res: Response) {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ error: "Thiếu userId" });
      return;
    }
    try {
      const project = await ProjectCarbon.find({ userId });
      res.json(project);
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi lấy project" });
      return;
    }
  }
  static async getAllProjectCarbons(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const projects = await ProjectCarbon.find({});
      res.status(200).json(projects);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      res
        .status(500)
        .json({ message: "Error fetching projects", error: error.message });
    }
  }

  static async getProjectCarbonById(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const project = await ProjectCarbon.findById(req.params.id);
      if (!project) {
        res.status(404).json({ message: "Project not found" }); // Removed return
      } else {
        res.status(200).json(project); // Removed return
      }
    } catch (error: any) {
      console.error("Error fetching project by ID:", error);
      if (error.name === "CastError") {
        res.status(400).json({ message: "Invalid Project ID" }); // Removed return
      } else {
        res
          .status(500)
          .json({ message: "Error fetching project", error: error.message }); // Removed return
      }
    }
  }

  static async updateProjectCarbon(req: Request, res: Response): Promise<void> {
    try {
      // Cast req.body to the input type for better type hinting
      const updateData = req.body as ProjectCarbonInputData;
      const projectId = req.params.id;
      if (
        updateData.details?.riceStartDate &&
        typeof updateData.details.riceStartDate === "string"
      ) {
        updateData.details.riceStartDate = new Date(
          updateData.details.riceStartDate,
        );
      }
      if (
        updateData.details?.riceEndDate &&
        typeof updateData.details.riceEndDate === "string"
      ) {
        updateData.details.riceEndDate = new Date(
          updateData.details.riceEndDate,
        );
      }

      const project = await ProjectCarbon.findByIdAndUpdate(
        projectId,
        updateData, // Mongoose can often handle nested updates if the structure matches the schema
        { new: true, runValidators: true }, // { new: true } returns the updated doc, { runValidators: true } validates updates
      );

      if (!project) {
        res.status(404).json({ message: "Project not found" }); // Removed return
      } else {
        res.status(200).json(project); // Removed return
      }
    } catch (error: any) {
      console.error("Error updating project:", error);
      if (error.name === "CastError") {
        res.status(400).json({ message: "Invalid Project ID" }); // Removed return
      } else if (error.name === "ValidationError") {
        res.status(400).json({ message: error.message }); // Removed return
      } else {
        res
          .status(500)
          .json({ message: "Error updating project", error: error.message }); // Removed return
      }
    }
  }

  static async deleteProjectCarbon(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectCarbon.findByIdAndDelete(req.params.id);

      if (!project) {
        res.status(404).json({ message: "Project not found" }); // Removed return
      } else {
        res
          .status(200)
          .json({ message: "Project deleted successfully", project }); // Removed return
      }
    } catch (error: any) {
      console.error("Error deleting project:", error);
      if (error.name === "CastError") {
        res.status(400).json({ message: "Invalid Project ID" }); // Removed return
      } else {
        res
          .status(500)
          .json({ message: "Error deleting project", error: error.message }); // Removed return
      }
    }
  }
}
