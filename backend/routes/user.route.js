const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.get("/test", (req, res) => {
  res.send("hello, it's working");
});

//REGISTER

router.post("/register", async (req, res) => {
  try {
    const { email, password, passwordCheck } = req.body;
    let displayName = req.body.displayName;

    //Validation
    if (!email || !password || !passwordCheck) {
      return res.status(400).send({ msg: "Not all field is filled" });
      
    }

    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      return res.status(400).json({ msg: "Email is invalid." });
    }

    if (password.length < 8) {
      return res.status(400).json({ msg: "minimum password length is 8." });
    }

    if (password !== passwordCheck) {
      return res.status(400).json({ msg: "password don't match." });
    }

    if (displayName < 3) {
      return res.status(400).json({ msg: "minimum Display Name length is 8." });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists." });
    }

    if (!displayName) displayName = email;

    //password hashing
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });

    const savedUser = await newUser.save();

    return res.json(savedUser);
  } catch (err) {
    return res.status(500).json({ error: `${err}` });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Not all field is filled" });
    }

    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      return res.status(400).json({ msg: "Email is invalid." });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist." });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ msg: "Invalid login credential." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: `${err}` });
  }
});

//DELETE

router.delete("/delete", auth, async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.user);

    if (!deleteUser) throw "User don't exist.";
    res.json({ msg: "User deleted." });
  } catch (err) {
    return res.status(500).json({ error: `${err}` });
  }
});

//TOKEN VALIDATION

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
});

module.exports = router;
