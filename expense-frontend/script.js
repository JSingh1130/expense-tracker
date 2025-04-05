document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const expenseTableContainer = document.getElementById("expense-table-container");
    const expenseTableBody = document.querySelector("#expenseTable tbody");
    const totalElement = document.getElementById("total");
    const chartContainer = document.getElementById("chart-container");
    const addExpenseButton = document.getElementById("add-expense-button");
    const loader = document.getElementById("loader");

    const API_URL = "https://expense-backend-z0rk.onrender.com";
    let expenseChart;

    const showLoader = () => loader && (loader.style.display = "flex");
    const hideLoader = () => loader && (loader.style.display = "none");

    // ✅ Hide loader after DOM loads (fixes signup.html infinite spinner issue)
    hideLoader();

    // ✅ Block access to tracker page without token
    if (window.location.pathname.includes("expense-tracker.html")) {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.replace("index.html");
        }

        // ✅ Prevent back navigation after logout
        window.addEventListener("pageshow", function (event) {
            const navigatedBack = event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward";
            if (navigatedBack && !localStorage.getItem("token")) {
                window.location.replace("index.html");
            }
        });
    }

    // ✅ Login handler
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem("token", data.token);
                    Swal.fire({
                        icon: "success",
                        title: "Login Successful",
                        text: "Welcome back!",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        window.location.href = "expense-tracker.html";
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Login Failed",
                        text: data.message || "Invalid credentials",
                    });
                }
            } catch (error) {
                console.error("Login error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong. Please try again.",
                });
            }
        });
    }

    // ✅ Signup handler
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("signup-username").value;
            const password = document.getElementById("signup-password").value;

            if (!username || !password) {
                return Swal.fire({
                    icon: "warning",
                    title: "Missing Fields",
                    text: "Please enter both username and password.",
                });
            }

            try {
                const res = await fetch(`${API_URL}/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const data = await res.json();

                if (res.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Signup Successful",
                        text: "Redirecting to login...",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        window.location.href = "index.html";
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Signup Failed",
                        text: data.message || "Something went wrong.",
                    });
                }
            } catch (error) {
                console.error("Signup error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Server error. Please try again.",
                });
            }
        });
    }

    // ✅ Fetch Expenses
    async function fetchExpenses() {
        if (!expenseTableBody || !totalElement || !chartContainer || !expenseTableContainer) return;

        const token = localStorage.getItem("token");
        if (!token) return window.location.href = "index.html";

        try {
            const res = await fetch(`${API_URL}/expenses`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const expenses = await res.json();
            let total = 0;
            let expenseData = {};

            expenseTableBody.innerHTML = "";
            expenseTableContainer.style.display = expenses.length ? "block" : "none";

            expenses.forEach(exp => {
                total += exp.amount;
                expenseData[exp.name] = (expenseData[exp.name] || 0) + exp.amount;

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${exp.name}</td>
                    <td>$${exp.amount}</td>
                    <td>${new Date(exp.date).toLocaleDateString()}</td>
                    <td><button onclick="deleteExpense('${exp._id}')">Delete</button></td>
                `;
                expenseTableBody.appendChild(row);
            });

            totalElement.textContent = total;

            if (Object.keys(expenseData).length) {
                chartContainer.style.display = "block";
                renderChart(expenseData);
            } else {
                chartContainer.style.display = "none";
            }
        } catch (err) {
            console.error("Fetch Expenses Error:", err);
        }
    }

    // ✅ Render Chart
    function renderChart(data) {
        const ctx = document.getElementById("expenseChart").getContext("2d");
        if (expenseChart) expenseChart.destroy();

        expenseChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: ["red", "blue", "green", "yellow", "purple"],
                }],
            },
            options: {
                plugins: {
                    legend: { display: false },
                },
            },
        });
    }

    // ✅ Add Expense
    async function addExpense() {
        const token = localStorage.getItem("token");
        if (!token) return window.location.href = "index.html";

        const name = document.getElementById("expense-name").value.trim();
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const date = document.getElementById("expense-date")?.value || new Date().toISOString();

        if (!name || isNaN(amount)) {
            return Swal.fire({
                icon: "warning",
                title: "Invalid Input",
                text: "Please fill all fields correctly.",
            });
        }

        try {
            const res = await fetch(`${API_URL}/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name, amount, date }),
            });

            if (res.ok) {
                Swal.fire({ icon: "success", title: "Expense Added", showConfirmButton: false, timer: 1200 });
                fetchExpenses();
            } else {
                Swal.fire({ icon: "error", title: "Failed to Add", text: "Expense could not be added." });
            }
        } catch (error) {
            console.error("Add Expense Error:", error);
            Swal.fire({ icon: "error", title: "Error", text: "Something went wrong while adding the expense." });
        }
    }

    if (addExpenseButton) addExpenseButton.addEventListener("click", addExpense);
    if (document.getElementById("expense-name")) fetchExpenses();

    // ✅ Delete Expense
    window.deleteExpense = async function (expenseId) {
        const token = localStorage.getItem("token");
        if (!token) return window.location.href = "index.html";

        await fetch(`${API_URL}/expenses/${expenseId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        fetchExpenses();
    };
});
