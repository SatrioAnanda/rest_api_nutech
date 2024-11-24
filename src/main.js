import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

web.listen(3001, () => {
  logger.info("Server running on port 3002");
});
