import * as documentModel from "../models/document.model.js";

export const getAllDocuments = async (req, res) => {
  try {
    const { houseId } = req.query;
    const documents = await documentModel.getAllDocuments(houseId);
    res.json(documents);
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await documentModel.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(document);
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createDocument = async (req, res) => {
  try {
    const { documentName, documentType, houseId } = req.body;
    
    if (!documentType || !houseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const documentId = await documentModel.createDocument(documentName, documentType, houseId);
    res.status(201).json({ message: "Document created", documentId });
  } catch (error) {
    console.error("Create document error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentName, documentType } = req.body;
    
    const success = await documentModel.updateDocument(id, documentName, documentType);
    if (!success) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ message: "Document updated" });
  } catch (error) {
    console.error("Update document error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await documentModel.deleteDocument(id);
    if (!success) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ message: "Document deleted" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
