const invoiceInput = document.getElementById("invoice");
const selectElement = document.querySelector(".custom-select");
const resultDiv = document.getElementById("result");
const legendContainer = document.querySelector(".legend_section");
const ctx = document.getElementById("myChart").getContext("2d");
ctx.canvas.parentNode.style.width = "400px";
ctx.canvas.parentNode.style.height = "400px";

const legendColors = ["#A5B99C", "#405952", "#C8C9C5", "#F2E5D6"];

const config = {
  type: "doughnut",
  data: {},
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: 90,
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};

let chart = new Chart(ctx, config);

let invoiceAmount = invoiceInput.value;
let age = "2";

function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, arguments), delay);
  };
}

function handleInvoiceChange() {
  invoiceAmount = invoiceInput.value;

  if (!invoiceAmount || !age) {
    return;
  }
  const { data, legend } = calculateSalaryDetails();

  drawChart(data);
  drawLegends(legend);
  showSummery(data);
}

function drawChart(calculatedData) {
  const newData = {
    labels: [
      "Din nettolön",
      "Tjänstepension",
      "Skatter & avgifter",
      "Bolagsbolaget avgift 6%",
    ],
    datasets: [
      {
        data: [
          calculatedData.netSalary,
          calculatedData.servicePension ? calculatedData.servicePension : 0,
          calculatedData.taxesAndFees,
          calculatedData.coolCompanyFee,
        ],
        backgroundColor: legendColors,
        hoverOffset: 4,
        spacing: 4,
      },
    ],
  };
  chart.data = newData;
  chart.update();
}

function drawLegends(legend) {
  legendContainer.innerHTML = "";

  legend.forEach((item) => {
    if (+item.value === 0) {
      return;
    }

    const legendItem = document.createElement("div");
    legendItem.classList.add("legend_row");

    const legendColor = document.createElement("div");
    legendColor.classList.add("legend_color");
    legendColor.style.backgroundColor = item.color;

    const legendLeft = document.createElement("div");
    legendLeft.classList.add("legend_left");
    legendLeft.textContent = item.label;

    const legendRight = document.createElement("div");
    legendRight.classList.add("legend_right");
    legendRight.textContent = item.value + " SEK";

    legendItem.appendChild(legendColor);
    legendItem.appendChild(legendLeft);
    legendItem.appendChild(legendRight);

    legendContainer.appendChild(legendItem);
  });
}

function showSummery(calculatedData) {
  const text =
    age === "2"
      ? `<li>
            <p>Lön på ditt konto</p>
            <p><span>${calculatedData.netSalary.toLocaleString()} SEK </span></p></li>
         <li>
            <p>Tjänstepension</p>
            <p><span>${
              calculatedData.servicePension
                ? calculatedData.servicePension.toLocaleString()
                : 0
            } SEK </span></p>
         </li>
         <li style="color: #175945;">
            <p style="font-weight: bold; color: #175945;">Total ersättning</p>
            <p><span>${
              calculatedData.servicePension
                ? (
                    +calculatedData.servicePension + +calculatedData.netSalary
                  ).toLocaleString()
                : 0
            } SEK </span></p>
          </li>
  `
      : `<li style="color: #175945;">
            <p style="font-weight: bold;">Lön på ditt konto</p>
            <p><span>${calculatedData.netSalary.toLocaleString()} SEK</span></p>
          </li>`;

  resultDiv.innerHTML = text;
}

function calculateSalaryDetails() {
  let result = {};

  if (!invoice || !age) {
    return null;
  } else if (age === "1") {
    // Calculation for age less than 25
    result = {
      netSalary: parseInt(invoiceAmount * (1 - 0.4394 - 0.06)),
      taxesAndFees: parseInt(invoiceAmount * 0.4394),
      coolCompanyFee: parseInt(invoiceAmount * 0.06),
      servicePension: 0,
    };
  } else if (age === "2") {
    // Calculation for age between 25 and 66
    result = {
      netSalary: parseInt(invoiceAmount * (1 - 0.03087 - 0.42896 - 0.06)),
      servicePension: parseInt(invoiceAmount * 0.03087),
      taxesAndFees: parseInt(invoiceAmount * 0.42896),
      coolCompanyFee: parseInt(invoiceAmount * 0.06),
    };
  } else if (age === "3") {
    // Calculation for age between 66 and 89
    result = {
      netSalary: parseInt(invoiceAmount * (1 - 0.34303 - 0.06)),
      taxesAndFees: parseInt(invoiceAmount * 0.34303),
      coolCompanyFee: parseInt(invoiceAmount * 0.06),
      servicePension: 0,
    };
  } else if (age === "4") {
    // Calculation for age above 90
    result = {
      netSalary: parseInt(invoiceAmount * (1 - 0.28206 - 0.06)),
      taxesAndFees: parseInt(invoiceAmount * 0.28206),
      coolCompanyFee: parseInt(invoiceAmount * 0.06),
      servicePension: 0,
    };
  }

  const legendData = [
    {
      label: "Din nettolön",
      value: parseInt(result.netSalary).toLocaleString(),
      color: legendColors[0],
    },
    {
      label: "Tjänstepension",
      value: parseInt(result.servicePension).toLocaleString(),
      color: legendColors[1],
    },
    {
      label: "Skatter & avgifter",
      value: parseInt(result.taxesAndFees).toLocaleString(),
      color: legendColors[2],
    },
    {
      label: "Bolagsbolaget avgift 6%",
      value: parseInt(result.coolCompanyFee).toLocaleString(),
      color: legendColors[3],
    },
  ];

  return { data: result, legend: legendData };
}

invoiceInput.oninput = debounce(handleInvoiceChange, 300);
handleInvoiceChange();

selectElement.addEventListener("click", function () {
  y = document.getElementsByClassName("select-selected");

  if (y[0].innerText === "< 24 år") {
    age = "1";
  } else if (y[0].innerText === "25 – 66 år") {
    age = "2";
  } else if (y[0].innerText === "67 – 89 år") {
    age = "3";
  } else if (y[0].innerText === "> 90 år") {
    age = "4";
  }
  handleInvoiceChange();
});
