import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    try {
        const decodedToken = jwt.decode(req.headers.authorization);

        const userId = decodedToken.user_id;

        if (!userId) {
            return res.status(401).json({ error: "Not logged in" });
        }

        req.user_id = userId;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Token is expired or invalid" });
    }
};

export default verifyToken;
