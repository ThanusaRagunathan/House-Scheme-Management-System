import * as houseModel from "../models/house.model.js";

export const getAllHouses = async (req, res) => {
  try {
    const { ownerId } = req.query;
    const houses = await houseModel.getAllHouses(ownerId);
    res.json(houses);
  } catch (error) {
    console.error("Get houses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const house = await houseModel.getHouseById(id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    res.json(house);
  } catch (error) {
    console.error("Get house error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createHouse = async (req, res) => {
  try {
    const { address, rooms, rentAmount, status, ownerId } = req.body;
    
    if (!address || !rooms || !rentAmount || !status || !ownerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const houseId = await houseModel.createHouse(address, rooms, rentAmount, status, ownerId);
    res.status(201).json({ message: "House created", houseId });
  } catch (error) {
    console.error("Create house error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, rooms, rentAmount, status } = req.body;
    
    const success = await houseModel.updateHouse(id, address, rooms, rentAmount, status);
    if (!success) {
      return res.status(404).json({ message: "House not found" });
    }
    res.json({ message: "House updated" });
  } catch (error) {
    console.error("Update house error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await houseModel.deleteHouse(id);
    if (!success) {
      return res.status(404).json({ message: "House not found" });
    }
    res.json({ message: "House deleted" });
  } catch (error) {
    console.error("Delete house error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
