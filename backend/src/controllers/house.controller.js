import * as houseModel from "../models/house.model.js";
import { ApiError } from "../middleware/error.middleware.js";

export const getAllHouses = async (req, res, next) => {
  try {
    const { ownerId } = req.query;
    const houses = await houseModel.getAllHouses(ownerId);
    res.json(houses);
  } catch (error) {
    next(error);
  }
};

export const getHouseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const house = await houseModel.getHouseById(id);
    if (!house) {
      throw new ApiError(404, "House not found");
    }
    res.json(house);
  } catch (error) {
    next(error);
  }
};

export const createHouse = async (req, res, next) => {
  try {
    const { referenceCode, address, rooms, rentAmount, status, ownerId } = req.body;
    
    if (!referenceCode || !address || !rooms || !rentAmount || !status || !ownerId) {
      throw new ApiError(400, "Missing required fields");
    }
    
    const houseId = await houseModel.createHouse(referenceCode, address, rooms, rentAmount, status, ownerId);
    res.status(201).json({ message: "House created", houseId });
  } catch (error) {
    next(error);
  }
};

export const updateHouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { referenceCode, address, rooms, rentAmount, status } = req.body;
    
    const success = await houseModel.updateHouse(id, referenceCode, address, rooms, rentAmount, status);
    if (!success) {
      throw new ApiError(404, "House not found");
    }
    res.json({ message: "House updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteHouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Backend: Attempting to delete house with ID: ${id}`);
    
    const success = await houseModel.deleteHouse(id);
    if (!success) {
      console.warn(`Backend: Delete failed, house not found for ID: ${id}`);
      throw new ApiError(404, `House not found (ID: ${id})`);
    }
    
    console.log(`Backend: Successfully deleted house ID: ${id}`);
    res.json({ message: "House deleted" });
  } catch (error) {
    console.error("Backend: Delete house error:", error);
    next(error);
  }
};
