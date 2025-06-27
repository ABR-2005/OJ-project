const express =require("express");

const{
    createProblem,
    getAllProblems,
    getProblemBYID,
    updateProblem,
    deleteProblem
} = require("../controllers/problemController");

const verifyToken =require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware")

const router = express.Router();

router.post("/", verifyToken,verifyAdmin,createProblem);
router.get("/",verifyToken,getAllProblems);
router.get("/:id",verifyToken,getProblemBYID);
router.put("/:id",verifyToken,verifyAdmin,updateProblem);
router.delete("/:id",verifyToken,verifyAdmin,deleteProblem);

module.exports = router;