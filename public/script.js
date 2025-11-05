"use strict";

const nav = document.querySelector("nav");
const hrSec = document.querySelector(".hero-sec");

const crtUser = document.getElementById("create-user");
const cadEmail = document.getElementById("cad-email");
const crtPass = document.getElementById("create-pass");
const confPass = document.getElementById("password");
const alertMsg = document.querySelector(".alert");
const cadAcc = document.getElementById("create-acc");

const logEmail = document.getElementById("validate-user");
const logPass = document.getElementById("validate-pass");
const logBtn = document.getElementById("validate-acc");

window.onscroll = function () {
  stickyNav();
};

function stickyNav() {
  console.log("Ah vamo nessa");
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    nav.classList.add("scroll");
  } else {
    nav.classList.remove("scroll");
  }
}

async function createUser() {
  if (
    crtUser.value == "" ||
    cadEmail.value == "" ||
    crtPass.value == "" ||
    confPass.value == ""
  ) {
    alertMsg.textContent = "Preencha todos os campos!";
  } else if (crtPass.value != confPass.value) {
    alertMsg.textContent = "As senhas não coincidem!";
    crtPass.value == "";
    confPass.value == "";
  } else if (crtPass.value.length < 8) {
    alertMsg.textContent = "Sua senha deve ter mais de 8 caracteres!";
  } else {
    const nome = crtUser.value.trim();
    const email = cadEmail.value.trim();
    const senha = confPass.value.trim();

    const resposta = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      alertMsg.textContent = dados.sucesso;
      setTimeout(() => (window.location.href = "login.html"), 1500);
    } else {
      alertMsg.textContent = dados.erro || "Erro ao cadastrar.";
    }
  }
}

if (cadAcc) {
  cadAcc.addEventListener("click", createUser);
}

async function logUser() {
  const email = logEmail.value.trim();
  const senha = logPass.value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos");
    return;
  }

  const resposta = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    localStorage.setItem("token", dados.token);
    localStorage.setItem("nome", dados.nome);
    window.location.href = "user.html";
  } else {
    alert(`${dados.erro}` || "Erro ao fazer login");
  }
}

if (logBtn) {
  logBtn.addEventListener("click", logUser);
}
