const currentUser =
    JSON.parse(
        localStorage.getItem("fintrack_currentUser")
    );

if (!currentUser) {
    window.location.href = "login.html";
}


const welcomeText =
    document.getElementById("welcomeText");

if (currentUser) {
    welcomeText.textContent =
        `Welcome back, ${currentUser.name}! Here's your financial overview.`;
}


let transactions =
    JSON.parse(
        localStorage.getItem("fintrack_transactions")
    ) || [];


function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


function calculateStats() {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            income += Number(transaction.amount);
        } else {
            expense += Number(transaction.amount);
        }

    });

    const balance = income - expense;

    document.getElementById("totalBalance")
        .textContent = formatCurrency(balance);

    document.getElementById("totalIncome")
        .textContent = formatCurrency(income);

    document.getElementById("totalExpense")
        .textContent = formatCurrency(expense);

    document.getElementById("totalSavings")
        .textContent = formatCurrency(balance);

}


function displayRecentTransactions() {

    const container =
        document.getElementById("recentTransactions");

    const recent =
        transactions
        .slice()
        .reverse()
        .slice(0, 5);

    if (recent.length === 0) {

        container.innerHTML = `
            <div class="text-center p-4 text-muted">
                No transactions yet.
            </div>
        `;

        return;
    }


    container.innerHTML = recent.map(transaction => {

        const isIncome =
            transaction.type === "income";

        return `

            <div class="d-flex justify-content-between
                        align-items-center
                        border-bottom py-3">

                <div class="d-flex align-items-center gap-3">

                    <div class="stat-icon
                        ${isIncome ? "income" : "expense"}">

                        <i class="fa-solid
                        ${isIncome
                            ? "fa-arrow-down"
                            : "fa-arrow-up"}">
                        </i>

                    </div>

                    <div>

                        <strong>
                            ${transaction.title}
                        </strong>

                        <small class="d-block text-muted">
                            ${transaction.category}
                            •
                            ${transaction.date}
                        </small>

                    </div>

                </div>

                <strong class="${isIncome
                    ? "text-success"
                    : "text-danger"}">

                    ${isIncome ? "+" : "-"}
                    ${formatCurrency(transaction.amount)}

                </strong>

            </div>

        `;

    }).join("");

}


let incomeExpenseChart;
let categoryChart;


function createCharts() {

    let income = 0;
    let expense = 0;

    const categories = {};


    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount);

        if (transaction.type === "income") {

            income += amount;

        } else {

            expense += amount;

            categories[transaction.category] =
                (categories[transaction.category] || 0)
                + amount;

        }

    });


    const incomeCanvas =
        document.getElementById(
            "incomeExpenseChart"
        );

    const categoryCanvas =
        document.getElementById(
            "categoryChart"
        );


    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

    if (categoryChart) {
        categoryChart.destroy();
    }


    incomeExpenseChart =
        new Chart(incomeCanvas, {

            type: "bar",

            data: {

                labels: [
                    "Income",
                    "Expenses"
                ],

                datasets: [{

                    data: [
                        income,
                        expense
                    ],

                    borderRadius: 10

                }]

            },

            options: {

                responsive: true,

                plugins: {
                    legend: {
                        display: false
                    }
                }

            }

        });


    categoryChart =
        new Chart(categoryCanvas, {

            type: "doughnut",

            data: {

                labels:
                    Object.keys(categories),

                datasets: [{

                    data:
                        Object.values(categories),

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        });

}


document
    .getElementById("transactionForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const transaction = {

            id: Date.now(),

            type:
                document.getElementById(
                    "transactionType"
                ).value,

            title:
                document.getElementById(
                    "transactionTitle"
                ).value,

            category:
                document.getElementById(
                    "transactionCategory"
                ).value,

            amount:
                Number(
                    document.getElementById(
                        "transactionAmount"
                    ).value
                ),

            date:
                document.getElementById(
                    "transactionDate"
                ).value

        };


        transactions.push(transaction);


        localStorage.setItem(
            "fintrack_transactions",
            JSON.stringify(transactions)
        );


        event.target.reset();


        bootstrap.Modal
            .getInstance(
                document.getElementById(
                    "transactionModal"
                )
            )
            .hide();


        refreshDashboard();

    });


function refreshDashboard() {

    calculateStats();

    displayRecentTransactions();

    createCharts();

}


document
    .getElementById("logoutBtn")
    .addEventListener("click", function() {

        localStorage.removeItem(
            "fintrack_currentUser"
        );

        window.location.href = "login.html";

    });


document
    .getElementById("themeBtn")
    .addEventListener("click", function() {

        document.body.classList.toggle("dark");

        const dark =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "fintrack_darkMode",
            dark
        );

    });


if (
    localStorage.getItem(
        "fintrack_darkMode"
    ) === "true"
) {

    document.body.classList.add("dark");

}


refreshDashboard();