import jwt from "jsonwebtoken";

import redisClient from "../redis";

const verifyToken = async (req, res, next) => {
    try {
        const decodedToken = jwt.decode(req.headers.authorization);

        const userId = decodedToken.user_id;
        if (!userId) {
            return res.status(401).json({ error: "Not logged in" });
        }

        const isBlackList = await redisClient.get(`black-list-token:${userId}`);
        if (isBlackList) {
            return res.status(401).json({ error: "Token is invalid" });
        }
        if (req.route.path == "/signout") {
            req.exp_token = decodedToken.exp;
        }

        req.user_id = userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token is expired or invalid" });
    }
};

export default verifyToken;
