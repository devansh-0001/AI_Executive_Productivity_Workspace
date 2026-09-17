import * as commitmentService from "../services/commitment.service.js";

export async function getCommitments(req, res, next) {
  try {
    const commitments = await commitmentService.getAllCommitments(req.query);
    res.json({ data: commitments });
  } catch (error) {
    next(error);
  }
}

export async function getCommitment(req, res, next) {
  try {
    const commitment = await commitmentService.getCommitmentById(req.params.id);
    if (!commitment) return res.status(404).json({ error: "Commitment not found" });
    res.json({ data: commitment });
  } catch (error) {
    next(error);
  }
}

export async function createCommitment(req, res, next) {
  try {
    const created = await commitmentService.createCommitment(req.body);
    res.status(201).json({ data: created });
  } catch (error) {
    next(error);
  }
}

export async function updateCommitment(req, res, next) {
  try {
    const updated = await commitmentService.updateCommitment(req.params.id, req.body);
    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteCommitment(req, res, next) {
  try {
    await commitmentService.deleteCommitment(req.params.id);
    res.json({ message: "Commitment deleted" });
  } catch (error) {
    next(error);
  }
}
