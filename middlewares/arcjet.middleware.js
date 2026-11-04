
import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    console.log("Arcjet Decision:", {
      id: decision.id,
      conclusion: decision.conclusion,
      reason: decision.reason,
      results: decision.results,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).send("Too Many Requests");
      }

      if (decision.reason.isBot()) {
        return res.status(403).send("Bot detected");
      }

      if (decision.reason.isShield()) {
        return res.status(403).send("Blocked by Arcjet Shield");
      }

      return res.status(403).send("Forbidden");
    }

    return next();
  } catch (err) {
    console.error("Error in Arcjet middleware:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export default arcjetMiddleware;
