// Usuarios predefinidos
const users = [
  { username: "admin", password: "1234" },
  { username: "user", password: "abcd" },
];

// Login
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Oculta login y muestra panel
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("panel-container").classList.remove("hidden");
    // Iniciar la recolección de datos
    fetchData();
  } else {
    // Muestra alerta de error
    document.getElementById("login-alert").classList.remove("hidden");
  }
}

// Logout
function logout() {
  document.getElementById("panel-container").classList.add("hidden");
  document.getElementById("login-container").classList.remove("hidden");

  // Limpia campos de login
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("login-alert").classList.add("hidden");

  // Limpiar datos del gráfico
  if (fanChart) {
    fanChart.destroy();
    temperatureHistory = [];
    fanSpeedHistory = [];
  }
}

let fanChart;
let temperatureHistory = [];
let fanSpeedHistory = [];

function initChart() {
  const ctx = document.getElementById("fanChart").getContext("2d");
  fanChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Temperatura (°C)",
          borderColor: "rgb(255, 99, 132)",
          data: temperatureHistory,
        },
        {
          label: "Velocidad Ventilador (%)",
          borderColor: "rgb(54, 162, 235)",
          data: fanSpeedHistory,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

function updateFanSpeed(temperature) {
  // Ajuste automático del ventilador basado en la temperatura
  let speed;
  if (temperature < 25) {
    speed = 20;
  } else if (temperature < 30) {
    speed = 40;
  } else if (temperature < 35) {
    speed = 60;
  } else if (temperature < 40) {
    speed = 80;
  } else {
    speed = 100;
  }

  document.getElementById("fan-speed").value = speed;
  document.getElementById("fan-speed-value").textContent = speed;
  return speed;
}

function fetchData() {
  initChart();
  setInterval(() => {
    const temperature = (20 + Math.random() * 15).toFixed(1);
    const humidity = (30 + Math.random() * 70).toFixed(1);
    const fanSpeed = updateFanSpeed(parseFloat(temperature));

    document.getElementById("temperature").textContent = temperature;
    document.getElementById("humidity").textContent = humidity;

    // Actualizar históricos
    const now = new Date();
    const timeLabel =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0") +
      ":" +
      now.getSeconds().toString().padStart(2, "0");

    temperatureHistory.push(temperature);
    fanSpeedHistory.push(fanSpeed);

    if (temperatureHistory.length > 10) {
      temperatureHistory.shift();
      fanSpeedHistory.shift();
      fanChart.data.labels.shift();
    }

    fanChart.data.labels.push(timeLabel);
    fanChart.update();

    if (humidity > 70) {
      document.getElementById("humidity-alert").classList.remove("hidden");
    } else {
      document.getElementById("humidity-alert").classList.add("hidden");
    }
  }, 2000);
}