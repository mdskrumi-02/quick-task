const invoiceInput = document.getElementById("invoice");
const selectElement = document.querySelector(".age_input select");
const resultDiv = document.getElementById("result");
const ctx = document.getElementById("myChart");

let chart;
const data = {
  labels: ["Net Salary", "Taxes & Fees", "Cool Company Fee", "Service Pension"],
  datasets: [
    {
      label: "Dataset",
      data: ["4803.70", "4289.60", "598.00", "308.70"],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
      ],
      hoverOffset: 4,
    },
  ],
};
const options = {
  plugins: {
    legend: {
      position: "right",
      labels: {
        generateLabels: function (chart) {
          const labels = [];
          const data = chart.data.datasets[0].data;

          data.forEach(function (value, index) {
            labels.push({
              text: `${chart.data.labels[index]}: ${value}`,
              fillStyle: chart.data.datasets[0].backgroundColor[index],
            });
          });

          return labels;
        },
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        padding: 10,
      },
    },
  },
};
const config = {
  type: "doughnut",
  data: data,
  options,
};

chart = new Chart(ctx, config);

let invoiceAmount = invoiceInput.value;
let age = selectElement.value;

function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, arguments), delay);
  };
}

function handleInvoiceChange() {
  if (!invoice || !age) {
    return;
  }
  invoiceAmount = invoiceInput.value;
  const calculation = calculateSalaryDetails();

  const newData = {
    labels: [
      "Net Salary",
      "Taxes & Fees",
      "Cool Company Fee",
      "Service Pension",
    ],
    datasets: [
      {
        label: "Dataset",
        data: [
          calculation.netSalary,
          calculation.taxesAndFees,
          calculation.coolCompanyFee,
          calculation.servicePension ? calculation.servicePension : 0,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const text =
    age === "2"
      ? `<li>
            <p>Salary on your account:</p>
            <p>${calculation.netSalary}</p></li>
         <li>
            <p>Service Pension:</p>
            <p>${
              calculation.servicePension ? calculation.servicePension : 0
            }</p>
         </li>
         <li>
            <p>Total compensation:</p>
            <p>${
              calculation.servicePension
                ? +calculation.servicePension + +calculation.netSalary
                : 0
            }</p>
          </li>
  `
      : `<li>
            <p>Salary on your account:</p>
            <p>${calculation.netSalary}</p>
          </li>`;

  resultDiv.innerHTML = text;
  chart.data = newData;

  chart.update();
}

function handleAgeChange(event) {
  age = event.target.value;
  handleInvoiceChange();
}

function calculateSalaryDetails() {
  console.log(invoiceAmount, age);

  if (!invoice || !age) {
    return null;
  } else if (age === "1") {
    const taxesAndFees = invoiceAmount * 0.4394;
    const coolCompanyFee = invoiceAmount * 0.0598;
    const netSalary = invoiceAmount - taxesAndFees - coolCompanyFee;
    return {
      netSalary: netSalary.toFixed(2),
      taxesAndFees: taxesAndFees.toFixed(2),
      coolCompanyFee: coolCompanyFee.toFixed(2),
    };
  } else if (age === "2") {
    const servicePension = invoiceAmount * 0.03087;
    const taxesAndFees = invoiceAmount * 0.42896;
    const coolCompanyFee = invoiceAmount * 0.0598;
    const netSalary =
      invoiceAmount - servicePension - taxesAndFees - coolCompanyFee;

    return {
      netSalary: netSalary.toFixed(2),
      servicePension: servicePension.toFixed(2),
      taxesAndFees: taxesAndFees.toFixed(2),
      coolCompanyFee: coolCompanyFee.toFixed(2),
    };
  } else if (age === "3") {
    const taxesAndFees = invoiceAmount * 0.34303;
    const coolCompanyFee = invoiceAmount * 0.0598;
    const netSalary = invoiceAmount - taxesAndFees - coolCompanyFee;

    return {
      netSalary: netSalary.toFixed(2),
      taxesAndFees: taxesAndFees.toFixed(2),
      coolCompanyFee: coolCompanyFee.toFixed(2),
    };
  } else if (age === "4") {
    const taxesAndFees = invoiceAmount * 0.28206;
    const coolCompanyFee = invoiceAmount * 0.0598;
    const netSalary = invoiceAmount - taxesAndFees - coolCompanyFee;

    return {
      netSalary: netSalary.toFixed(2),
      taxesAndFees: taxesAndFees.toFixed(2),
      coolCompanyFee: coolCompanyFee.toFixed(2),
    };
  }
}

invoiceInput.oninput = debounce(handleInvoiceChange, 300);
selectElement.onchange = handleAgeChange;
handleInvoiceChange();
