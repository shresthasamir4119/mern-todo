const router = require("express").Router();
const Todo = require("../models/todo.model");
const auth = require("../middleware/auth");

//Add

router.post("/", auth, async (req, res) => {
  try {
    const { todo } = req.body;

    //Validation
    if (!todo) {
      return res.status(400).json({ msg: "No todo" });
    }

    const existingTodo = await Todo.findOne({ todo: todo });

    if (existingTodo) {
      return res.status(400).json({ msg: "Todo already exists." });
    }

    const newTodo = new Todo({
      todo,
      isCompleted: false,
      userId: req.user,
    });

    const savedTodo = await newTodo.save();

    return res.json(savedTodo);
  } catch (err) {
    return res.status(500).json({ error: `${err}` });
  }
});

//DELETE

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleteTodo = await Todo.findById(req.params.id);

    if (!deleteTodo) throw "Todo don't exist.";

    if (deleteTodo.userId === req.user) {
      await Todo.findByIdAndDelete(req.body.id);
      res.json({ msg: "Todo deleted." });
    } else throw " Not authorized.";
  } catch (err) {
    return res.status(500).json({ error: `${err}` });
  }
});

//GET
router.get("/", auth, async (req, res) => {
  const todo = await Todo.findOne({ userId: req.user });
  res.json({
    todo: todo.todo,
    id: todo._id,
    isCompleted: todo.isCompleted,
  });
});

module.exports = router;
