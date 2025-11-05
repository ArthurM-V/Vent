const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");

dotenv.config();

const SECRET = process.env.SECRET_KEY;
const PORT = process.env.PORT || 3000;
const USERS_PATH = path.join(__dirname, process.env.USERS_PATH);
const SALT_ROUNDS = 10;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

function lerUsuarios() {
  if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(USERS_PATH, "[]");
  }
  const data = fs.readFileSync(USERS_PATH);
  return JSON.parse(data);
}

function salvarUsuarios(lista) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(lista, null, 2));
}

app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  const hash = await bcrypt.hash(senha, SALT_ROUNDS);

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  if (senha.length < 8) {
    return res
      .status(400)
      .json({ erro: "A senha deve ter pelo menos 8 caracteres." });
  }

  const usuarios = lerUsuarios();
  const existente = usuarios.find((u) => u.email === email);
  if (existente) {
    return res.status(400).json({ erro: "E-mail já cadastrado." });
  }

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha: hash,
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  return res.json({ sucesso: "Usuário cadastrado com sucesso!" });
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const usuarios = lerUsuarios();
  const user = usuarios.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ erro: "Email ou senha inválidos" });
  }

  const valido = await bcrypt.compare(senha, user.senha);
  if (!valido)
    return res.status(401).json({ erro: "Email ou senha inválidos" });

  const token = jwt.sign(
    { id: user.id, nome: user.nome, email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, nome: user.nome });
});

function autenticar(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ erro: "Token ausente" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ erro: "Token inválido" });
    req.user = user;
    next();
  });
}

app.get("/user-data", autenticar, (req, res) => {
  res.json({ mensagem: `Bem-vindo, ${req.user.nome}!` });
});

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/landing.html"));
});

app.listen(PORT, () => {
  console.log("Servidor rodando no port 3000");
});
