const { getAuth } = require("@clerk/express");
const ReviewHistory = require("../models/reviewHistory.model");
const aiService = require("../services/ai.service");
const {
  connectToDatabase,
  getDatabaseStatus,
  isDatabaseConnected,
} = require("../config/database");

const HISTORY_PAGE_SIZE = 20;

function serializeHistoryItem(item) {
  return {
    id: item.id,
    code: item.code,
    review: item.review,
    createdAt: item.createdAt,
  };
}

async function ensureHistoryStorageAvailable() {
  if (isDatabaseConnected()) {
    return true;
  }

  console.log(`[MongoDB] History request received while status is "${getDatabaseStatus()}".`);
  await connectToDatabase();

  if (isDatabaseConnected()) {
    return true;
  }

  const error = new Error("History storage is unavailable right now. Please try again shortly.");
  error.statusCode = 503;
  throw error;
}

module.exports.getReview = async (req, res) => {
  try {
    const code = req.body?.code;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await aiService(code);
    const { userId } = getAuth(req);
    let historyEntry = null;

    if (userId) {
      try {
        await ensureHistoryStorageAvailable();
        const savedHistory = await ReviewHistory.create({
          clerkUserId: userId,
          code,
          review: response,
        });

        historyEntry = serializeHistoryItem(savedHistory);
      } catch (historyError) {
        console.error("Failed to save review history:", historyError);
      }
    }

    return res.status(200).json({
      success: true,
      data: response,
      historyEntry,
    });
  } catch (error) {
    const statusCode = error?.statusCode === 503 ? 503 : 500;
    return res.status(statusCode).json({
      success: false,
      message:
        error?.message ||
        (statusCode === 503
          ? "AI service is temporarily unavailable. Please try again shortly."
          : "Failed to generate review."),
    });
  }
};

module.exports.getHistory = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to access saved history.",
      });
    }

    await ensureHistoryStorageAvailable();

    const history = await ReviewHistory.find({ clerkUserId: userId })
      .sort({ createdAt: -1 })
      .limit(HISTORY_PAGE_SIZE);

    return res.status(200).json({
      success: true,
      data: history.map(serializeHistoryItem),
    });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error?.message || "Failed to load saved history.",
    });
  }
};

module.exports.clearHistory = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to clear saved history.",
      });
    }

    await ensureHistoryStorageAvailable();

    await ReviewHistory.deleteMany({ clerkUserId: userId });

    return res.status(200).json({
      success: true,
      message: "History cleared successfully.",
    });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error?.message || "Failed to clear saved history.",
    });
  }
};
