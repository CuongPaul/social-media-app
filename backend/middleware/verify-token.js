import jwt from "jsonwebtoken";

import redisClient from "../helpers/redis";

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    try {
        const { exp, user_id } = jwt.verify(token, process.env.JWT_SECRET);

        if (!user_id) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const isBlackList = await redisClient.get(`black-list-token:${token}`);
        if (isBlackList) {
            return res.status(401).json({ message: "Token is invalid" });
        }

        if (req.route.path == "/signout") {
            req.exp_token = exp;
        }

        req.user_id = user_id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is expired or invalid" });
    }
};

export default verifyToken;
