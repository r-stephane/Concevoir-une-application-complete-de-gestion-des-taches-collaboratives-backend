const express = require("express");
const clientController = require("../controllers/clientController");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/",clientController.getClients);
router.get("/:id",clientController.getClientId); 
router.post("/", authMiddleware,clientController.addClient);
router.patch("/:id", authMiddleware,clientController.updateClient);
router.patch("/:id/stock", authMiddleware,clientController.updateStock); 
router.delete("/:id", authMiddleware,clientController.deletedClient);

module.exports = router;