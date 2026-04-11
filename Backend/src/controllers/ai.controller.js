const aiService = require("../services/ai.service")


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
        return res.status(200).json({
            success: true,
            data: response,
        });
    } catch (error) {
        const statusCode = error?.statusCode === 503 ? 503 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error?.message || (
                statusCode === 503
                    ? "AI service is temporarily unavailable. Please try again shortly."
                    : "Failed to generate review."
            ),
        });
    }
}
