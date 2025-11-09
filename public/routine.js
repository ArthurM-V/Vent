"use strict";

const userName = localStorage.getItem("nome") || "Perfil";
const ttlName = document.querySelector(".profile-nick");
ttlName.textContent = userName;

const openStats = document.querySelector(".cm-graph");
const graph = document.getElementById("grafico");
const overlay = document.querySelector(".overlay");
const scrGraph = document.querySelector(".graph-cont");
const closeStats = document.getElementById("close-stats");

const dcTouch = document.querySelector(".dc-up");
const dcDown = document.querySelector(".drop-config");
const catUp = document.querySelector(".cat-up");
const catDrop = document.querySelector(".dc-drop");

const thUp = document.querySelector(".th-up");
const thDrop = document.querySelector(".th-drop");

const dcDrop = document.querySelector("cm-config");

const catTtl = document.getElementById("cat-ttl");
const addCat = document.getElementById("add-cat");

const dayTxt = document.getElementById("date-day");

const dailyBrd = document.querySelector(".daily-board");
const actTtl = document.getElementById("act-title");
const actCat = document.getElementById("category");
const actDesc = document.getElementById("act-desc");
const emoSld = document.getElementById("emo-slider");
const createBtn = document.getElementById("create-btn");

const regAct = document.getElementById("reg-act");
const avgAct = document.getElementById("avg-act");

let mdValue = [];
let moodMap = {
  sad: 0,
  tired: 0,
  neutral: 0,
  smile: 0,
  happy: 0,
};

const bgRadio = document.querySelectorAll('input[name="bg-color"]');
const themeRadio = document.querySelectorAll('input[name="theme-color"]');

const currTheme = document.documentElement.getAttribute("data-theme");
const currPalette = document.documentElement.getAttribute("data-palette");

const svThRadio = document.querySelector(
  `input[name="bg-color"][value="${currTheme}"]`
);
const svPltRadio = document.querySelector(
  `input[name="theme-color"][value="${currPalette}"]`
);

// === SISTEMA DE TEMAS ===
if (svThRadio) svThRadio.checked = true;
if (svPltRadio) svPltRadio.checked = true;

bgRadio.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const theme = e.target.value;
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  });
});

themeRadio.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const palette = e.target.value;
    if (palette === "green") {
      document.documentElement.removeAttribute("data-palette");
      localStorage.removeItem("palette");
    } else {
      document.documentElement.setAttribute("data-palette", palette);
      localStorage.setItem("palette", palette);
    }
  });
});

// === ROTAÇÃO DO ÍCONE DE TEMAS ===
dcTouch.addEventListener("click", () => {
  console.log("click!");
  if (dcDown.classList.contains("th-active")) {
    dcDown.classList.remove("th-active");
    document.querySelector(".dc-up span").style.transform = "rotate(0deg)";
  } else {
    dcDown.classList.add("th-active");
    document.querySelector(".dc-up span").style.transform = "rotate(90deg)";
  }
});

catUp.addEventListener("click", () => {
  console.log("click!");
  if (catDrop.classList.contains("th-active")) {
    catDrop.classList.remove("th-active");
    document.querySelector(".cat-up span").style.transform = "rotate(0deg)";
  } else {
    catDrop.classList.add("th-active");
    document.querySelector(".cat-up span").style.transform = "rotate(180deg)";
  }
});

thUp.addEventListener("click", () => {
  console.log("click!");
  if (thDrop.classList.contains("th-active")) {
    thDrop.classList.remove("th-active");
    document.querySelector(".th-up span").style.transform = "rotate(0deg)";
  } else {
    thDrop.classList.add("th-active");
    document.querySelector(".th-up span").style.transform = "rotate(180deg)";
  }
});

// === ATUALIZAÇÃO DA DATA ===
let date = new Date();

const nomeMes = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const diaSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

dayTxt.textContent = `${diaSemana[date.getDay()]}  ▷ ${date.getDate()} / ${
  nomeMes[date.getMonth()]
} / ${date.getFullYear()}`;

function disappear(element) {
  element.classList.toggle("hidden");
  console.log("Salve");
}

// === SISTEMA DE ROTINAS ===

function addCategory() {
  if (!catTtl.value) {
    alert("Para adicionar uma categoria, adicione um título primeiro!");
  }

  const newCat = document.createElement("div");

  newCat.innerHTML = `<option value="${catTtl.value}">${catTtl.value}</option>`;

  actCat.append(newCat);

  catTtl.value = "";
}

function createActv() {
  const actEmo = document.querySelector('input[name="emoji-check"]:checked');

  if (
    actTtl.value != "" &&
    actCat.value != "" &&
    actDesc.value != "" &&
    !!actEmo
  ) {
    const card = document.createElement("div");
    let catText = actCat.value;
    card.classList.add("daily-act");
    if (actCat.value == "No") {
      catText = "";
    }
    card.innerHTML = `
              <div class="redu-act">
                <div class="act-txt">
                  <h1 id="act-ttl">${actTtl.value}</h1>
                  <h1 id="act-cat">${catText}</h1>
                </div>
                <button id="delete-act">X</button>
              </div>
              <div class="exp-act">
                <p class="act-desc">${actDesc.value}</p>
                <div class="emoji-display">
                  <img src="/img/${actEmo.value}.png" alt="${actEmo.value}" />
                </div>
              </div>
              `;
    dailyBrd.appendChild(card);

    const deleteBtn = card.querySelector("#delete-act");

    const activity = {
      title: actTtl.value,
      desc: actDesc.value,
      emoji: actEmo.value,
      category: catText,
    };

    let activities = JSON.parse(localStorage.getItem("activities")) || [];

    activities.push(activity);

    mdValue.push(activity.emoji);

    for (let i = 0; i < mdValue.length; i++) {
      for (const [key, value] of Object.entries(moodMap)) {
        if (mdValue[i] == key) {
          moodMap[key] += 1;
        }
      }
    }

    localStorage.setItem("activities", JSON.stringify(activities));

    deleteBtn.addEventListener("click", () => {
      card.remove();
      activities = activities.filter((a) => a.title !== activity.title);
      localStorage.setItem("activities", JSON.stringify(activities));
    });

    actTtl.value = "";
    actCat.value = "";
    actDesc.value = "";
    actEmo.checked = false;

    const reduAct = card.querySelector(".redu-act");
    const expAct = card.querySelector(".exp-act");

    reduAct.addEventListener("click", () => {
      if (!expAct.classList.contains("active")) {
        expAct.classList.add("active");
      } else {
        expAct.classList.remove("active");
      }
    });
  } else {
    alert("Preencha todos os campos para registrar uma atividade!");
  }
}
createBtn.addEventListener("click", createActv);

let activities = JSON.parse(localStorage.getItem("activities")) || [];
window.addEventListener("load", () => {
  activities.forEach((activity) => {
    const card = document.createElement("div");
    card.classList.add("daily-act");
    card.innerHTML = `
                      <div class="redu-act">
                        <div class="act-txt">
                          <h1 id="act-ttl">${activity.title}</h1>
                          <h1 id="act-cat">${activity.category}</h1>
                        </div>
                        <button id="delete-act">X</button>
                        </div>
                        <div class="exp-act">
                          <p class="act-desc">${activity.desc}</p>
                          <div class="emoji-display">
                            <img src="/img/${activity.emoji}.png" alt="${activity.emoji}" />
                          </div>
                        </div>
                    `;
    dailyBrd.appendChild(card);

    card.addEventListener("click", (e) => {
      const exp = card.querySelector(".exp-act");
      exp.classList.toggle("active");
      if (e.target.id == "delete-act") {
        console.log("click");
        card.remove();
        activities = activities.filter((a) => a.title !== activity.title);
        localStorage.setItem("activities", JSON.stringify(activities));
      }
    });
  });
});

addCat.addEventListener("click", addCategory);

// === GRÁFICOS ===

function statScreen() {
  if (scrGraph.classList.contains("show")) {
    overlay.classList.remove("show");
    overlay.classList.add("hide");

    scrGraph.classList.remove("show");
    scrGraph.classList.add("hide");

    setTimeout(() => {
      overlay.classList.remove("hide");
      scrGraph.classList.remove("hide");
    }, 400);
  } else {
    overlay.classList.remove("hide");
    overlay.classList.add("show");

    scrGraph.classList.remove("hide");
    scrGraph.classList.add("show");
  }

  for (const key in moodMap) moodMap[key] = 0;

  let allActs = JSON.parse(localStorage.getItem("activities")) || [];

  allActs.forEach((act) => {
    if (moodMap.hasOwnProperty(act.emoji)) {
      moodMap[act.emoji]++;
    }
  });

  const emoTrad = {
    sad: "Triste",
    tired: "Cansado",
    neutral: "Neutro",
    smile: "Animado",
    happy: "Feliz",
  };

  let emoCount = 0;
  let curr = 0;
  let comMood = "";

  for (const [key, value] of Object.entries(moodMap)) {
    if (moodMap[key] > 0) emoCount += value;

    if (value > curr) {
      curr = value;
      comMood = key;
    }
  }

  regAct.textContent = `Atividades registradas hoje: ${emoCount}`;
  avgAct.textContent = `Humor mais comum durante o dia: ${
    emoTrad[comMood] || "Nenhum registrado"
  }`;

  if (Chart.getChart(graph)) {
    Chart.getChart(graph).destroy();
    emoCount = 0;
  }

  if (
    moodMap.sad == 0 &&
    moodMap.tired == 0 &&
    moodMap.neutral == 0 &&
    moodMap.smile == 0 &&
    moodMap.happy == 0
  ) {
    document.querySelector(".graph-warn").classList.toggle("hidden");
  }

  const moodChart = new Chart(graph, {
    type: "doughnut",
    data: {
      labels: ["Triste", "Cansado", "Neutro", "Animado", "Feliz"],
      datasets: [
        {
          label: "Quantidade de registros",
          data: [
            moodMap.sad,
            moodMap.tired,
            moodMap.neutral,
            moodMap.smile,
            moodMap.happy,
          ],
          backgroundColor: [
            "#1da54aff",
            "#268de2ff",
            "#dd5719ff",
            "#d6253cff",
            "#FFC107",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            font: {
              size: 15,
              family: "Arial",
            },
            color: "grey",
            boxWidth: 20,
            padding: 15,
          },
        },
      },
    },
  });
  moodChart.update();
}

overlay.addEventListener("click", statScreen);
openStats.addEventListener("click", statScreen);

closeStats.addEventListener("click", statScreen);
