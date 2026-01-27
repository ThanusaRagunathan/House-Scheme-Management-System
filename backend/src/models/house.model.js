import db from "../config/db.js";

export const getAllHouses = async (ownerId = null) => {
  let query = "SELECT * FROM houses";
  const params = [];
  
  if (ownerId) {
    query += " WHERE owner_id = ?";
    params.push(ownerId);
  }
  
  const [rows] = await db.query(query, params);
  return rows;
};

export const getHouseById = async (houseId) => {
  const [rows] = await db.query(
    "SELECT * FROM houses WHERE house_id = ?",
    [houseId]
  );
  return rows[0];
};

export const createHouse = async (address, rooms, rentAmount, status, ownerId) => {
  const [result] = await db.query(
    "INSERT INTO houses (address, rooms, rent_amount, status, owner_id) VALUES (?, ?, ?, ?, ?)",
    [address, rooms, rentAmount, status, ownerId]
  );
  return result.insertId;
};

export const updateHouse = async (houseId, address, rooms, rentAmount, status) => {
  const [result] = await db.query(
    "UPDATE houses SET address = ?, rooms = ?, rent_amount = ?, status = ? WHERE house_id = ?",
    [address, rooms, rentAmount, status, houseId]
  );
  return result.affectedRows > 0;
};

export const deleteHouse = async (houseId) => {
  const [result] = await db.query(
    "DELETE FROM houses WHERE house_id = ?",
    [houseId]
  );
  return result.affectedRows > 0;
};
