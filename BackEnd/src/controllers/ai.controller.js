const aiServices = require("../services/ai.service");

const getReview = async (req, res) => {
    const code = req.body.code;

    if (!code) {
        return res.status(400).send("Code is required");
    }

    const response = await aiServices(code);
    res.send(response);
};

module.exports = { getReview };
