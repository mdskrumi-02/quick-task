const invoiceInput = document.getElementById("invoice");
const selectElement = document.querySelector(".custom-select");
const resultDiv = document.getElementById("result");
const legendContainer = document.querySelector(".legend_section");
const ctx = document.getElementById("myChart").getContext("2d");
ctx.canvas.parentNode.style.width = "400px";
ctx.canvas.parentNode.style.height = "400px";

const legendColors = [
  "rgb(180, 104, 199)",
  "rgb(0, 134, 201)",
  "rgb(247, 144, 9)",
  "rgb(155, 69, 46)",
];

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
      "Cool Companys avgift 5,98%",
    ],
    datasets: [
      {
        data: [
          calculatedData.netSalary.toFixed(0),
          calculatedData.servicePension
            ? calculatedData.servicePension.toFixed(0)
            : 0,
          calculatedData.taxesAndFees.toFixed(0),
          calculatedData.coolCompanyFee.toFixed(0),
        ],
        backgroundColor: legendColors,
        hoverOffset: 4,
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
            <p>${calculatedData.netSalary.toFixed(0)} SEK</p></li>
         <li>
            <p>Tjänstepension 
            
            <span class="tooltip">
            <img src="./assets/Icon-gray.png" alt="info" />
            <span class="tooltiptext"
              >Cool Company är sedan 1 januari 2023 anslutna till
              kollektivavtal och avsätter därmed automatiskt 4,5 procent av
              ditt intjänade arvode till tjänstepension åt dig.</span
            >
          </span>


            </p>
            <p>${
              calculatedData.servicePension
                ? calculatedData.servicePension.toFixed(0)
                : 0
            } SEK</p>
         </li>
         <li style="font-weight: bold; color: #175945;">
            <p>Total ersättning</p>
            <p>${
              calculatedData.servicePension
                ? (
                    +calculatedData.servicePension + +calculatedData.netSalary
                  ).toFixed(0)
                : 0
            } SEK</p>
          </li>
  `
      : `<li style="font-weight: bold; color: #175945;">
            <p>Lön på ditt konto</p>
            <p>${calculatedData.netSalary.toFixed(0)} SEK</p>
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
      netSalary: invoiceAmount * (1 - 0.4394 - 0.0598),
      taxesAndFees: invoiceAmount * 0.4394,
      coolCompanyFee: invoiceAmount * 0.0598,
      servicePension: 0,
    };
  } else if (age === "2") {
    // Calculation for age between 25 and 66
    result = {
      netSalary: invoiceAmount * (1 - 0.03087 - 0.42896 - 0.0598),
      servicePension: invoiceAmount * 0.03087,
      taxesAndFees: invoiceAmount * 0.42896,
      coolCompanyFee: invoiceAmount * 0.0598,
    };
  } else if (age === "3") {
    // Calculation for age between 66 and 89
    result = {
      netSalary: invoiceAmount * (1 - 0.34303 - 0.0598),
      taxesAndFees: invoiceAmount * 0.34303,
      coolCompanyFee: invoiceAmount * 0.0598,
      servicePension: 0,
    };
  } else if (age === "4") {
    // Calculation for age above 90
    result = {
      netSalary: invoiceAmount * (1 - 0.28206 - 0.0598),
      taxesAndFees: invoiceAmount * 0.28206,
      coolCompanyFee: invoiceAmount * 0.0598,
      servicePension: 0,
    };
  }

  const legendData = [
    {
      label: "Din nettolön",
      value: result.netSalary.toFixed(0),
      color: legendColors[0],
    },
    {
      label: "Tjänstepension",
      value: result.servicePension.toFixed(0),
      color: legendColors[1],
    },
    {
      label: "Skatter & avgifter",
      value: result.taxesAndFees.toFixed(0),
      color: legendColors[2],
    },
    {
      label: "Cool Companys avgift 5,98%",
      value: result.coolCompanyFee.toFixed(0),
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
