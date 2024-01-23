import { Request, Response } from "express";
import Region from "../database/models/Region.model";
import { ValidationError, Op } from "sequelize";

export default class RegionController {
  static async getAllRegions(req: Request, res: Response) {
    // let pageNumber = Number(req.query.page) || 1;
    // const limit = 2;
    // const totalItems = await Region.count();
    // const totalPages = Math.ceil(totalItems / limit);
    // pageNumber = Math.max(1, Math.min(pageNumber, totalPages));
    // const offset = (pageNumber - 1) * limit;

    // const regions = await Region.findAll({
    //   limit,
    //   offset,
    // });

    // res.json({
    //   totalItems,
    //   regions,
    //   totalPages,
    //   currentPage: pageNumber,
    //   perPage: limit,
    //   first: offset + 1,
    //   last: Math.min(offset + limit, totalItems),
    // });
    const regions = await Region.findAll();
    res.json(regions)
  }

  static async searchRegions(req: Request, res: Response) {
    const query = req.query.q?.toString();
    let regions;
    if (!query) {
      regions = await Region.findAll();
    }
    regions = await Region.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
    });
    res.json(regions);
  }

  static async getRegionById(req: Request<{ id: string }>, res: Response) {
    const region = await Region.findByPk(req.params.id);
    if (region) {
      res.json(region);
    } else {
      res.status(404).send("Region not found");
    }
  }

  static async createRegion(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const newRegion = await Region.create(req.body);
      return res.json(newRegion);
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res
          .status(400)
          .json({ error: "Region name must be unique." });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }

  static async updateRegion(req: Request<{ id: string }>, res: Response) {
    try {
      const region = await Region.findByPk(req.params.id);
      if (region) {
        const updatedRegion = await region.update(req.body);
        res.json(updatedRegion);
      } else {
        res.status(404).send("Region not found");
      }
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res
          .status(400)
          .json({ error: "Region name must be unique." });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }

  static async deleteRegion(req: Request<{ id: string }>, res: Response) {
    const region = await Region.findByPk(req.params.id);
    if (region) {
      await region.destroy();
      res.status(204).send();
    } else {
      res.status(404).send("Region not found");
    }
  }
}