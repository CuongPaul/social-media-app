import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.split("Bearer ")[1];

        if (token) {
            try {
                const decodedToken = jwt.decode(token);

                const userId = decodedToken.user_id;

                if (userId) {
                    req.user_id = userId;

                    next();
                } else {
                    return res.status(400).json({ error: "Not logged in" });
                }
            } catch (err) {
                return res.status(400).json({ error: "Token is expired or invalid" });
            }
        } else {
            return res.status(400).json({ error: "Not logged in" });
        }
    } else {
        return res.status(400).json({ error: "Not logged in" });
    }
};

export default verifyToken;
