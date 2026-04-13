import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import pageStyle from "../styles/pageStyle";
import theme from "../styles/theme";
import { cardStyle } from "../styles/components";
import { authFetch } from "../utils/authFetch";
import Layout from "../components/Layout";

function Budget() {
    const { projectId } = useParams();

    const [budget, setBudget] = useState({ planned: 0, actual: 0, remaining: 0, expenses: [] });
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("General");
    const [plannedBudget, setPlannedBudget] = useState(0);

    useEffect(() => {
        loadBudget();
        if (!projectId) return;
    }, [projectId]);

    function loadBudget() {
        authFetch(`http://localhost:5000/api/projects/${projectId}/budget`)
            .then((res) => res.json())
            .then((data) => {
                setBudget({
                    planned: data.planned || 0,
                    actual: data.actual || 0,
                    remaining: data.remaining || 0,
                    expenses: Array.isArray(data.expenses) ? data.expenses : [],
                });
                setPlannedBudget(data.planned || 0);
            })
            .catch(console.error);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const payload = { title, amount, category };

        if (editingExpenseId !== null) {
            authFetch(
                `http://localhost:5000/api/projects/${projectId}/budget/${editingExpenseId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            )
                .then((res) => res.json())
                .then(() => {
                    loadBudget();
                    resetForm();
                })
                .catch(console.error);
        } else {
            authFetch(
                `http://localhost:5000/api/projects/${projectId}/budget`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            )
                .then((res) => res.json())
                .then(() => {
                    loadBudget();
                    resetForm();
                })
                .catch(console.error);
        }
    }

    function deleteExpense(expenseId) {
        authFetch(
            `http://localhost:5000/api/projects/${projectId}/budget/${expenseId}`,
            { method: "DELETE" }
        )
            .then(() => loadBudget())
            .catch(console.error);
    }

    function resetForm() {
        setEditingExpenseId(null);
        setTitle("");
        setAmount("");
        setCategory("General");
    }

    function updatePlannedBudget() {
        authFetch(`http://localhost:5000/api/projects/${projectId}/budget/planned`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planned: Number(plannedBudget) }),
        })
            .then(res => res.json())
            .then(loadBudget)
            .catch(console.error);
    }

    return (
        <Layout>
            <div style={pageStyle}>
                <h2>💰 Budget Management</h2>

                <div style={cardStyle}>
                    <h3>Planned: ₹ {budget.planned}</h3>
                    <p>Spent: ₹ {budget.actual}</p>
                    <p
                        style={{
                            color:
                                budget.remaining < 0
                                    ? theme.colors.danger
                                    : theme.colors.success,
                            fontWeight: "600",
                        }}
                    >
                        {budget.remaining < 0
                            ? `Over Budget by ₹${Math.abs(budget.remaining)}`
                            : `Remaining ₹${budget.remaining}`}
                    </p>
                </div>

                <div style={{ ...cardStyle, marginBottom: "20px" }}>
                    <h3>🎯 Planned Budget</h3>

                    <input
                        type="number"
                        value={plannedBudget}
                        onChange={(e) => setPlannedBudget(e.target.value)}
                        style={{ ...styles.input, marginBottom: "10px" }}
                        placeholder="Enter planned budget"
                    />

                    <button onClick={updatePlannedBudget}>
                        💾 Save Planned Budget
                    </button>
                </div>

                <div style={styles.panel}>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input
                            placeholder="Expense Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={styles.input}
                        />

                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={styles.input}
                        />

                        <button type="submit" style={styles.button}>
                            {editingExpenseId ? "✅ Update Expense" : "➕ Add Expense"}
                        </button>
                    </form>
                </div>

                <div style={{ marginTop: "30px" }}>
                    {budget.expenses.length === 0 && <p>No expenses added</p>}

                    {(budget.expenses || []).map((expense) => (
                        <div
                            key={expense._id} style={styles.expenseCard}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <strong
                                    style={{
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {expense.title}
                                </strong>
                                <div style={{ fontSize: "12px", color: "#aaa" }}>
                                    ₹ {expense.amount}
                                </div>
                            </div>

                            <button
                                style={styles.deleteBtn}
                                onClick={() => deleteExpense(expense._id)}
                            >
                                🗑️
                            </button>

                            <button
                                style={styles.editBtn}
                                onClick={() => {
                                    setEditingExpenseId(expense._id);
                                    setTitle(expense.title);
                                    setAmount(expense.amount);
                                    setCategory(expense.category);
                                }}
                            >
                                ✏️
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Budget;

const styles = {
    panel: {
        background: theme.colors.panel,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        padding: "20px",
        marginTop: "20px",
    },
    form: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
    },
    input: {
        padding: "10px",
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.card,
        color: theme.colors.textPrimary,
    },
    button: {
        padding: "10px 16px",
        background: theme.colors.accent,
        border: "none",
        borderRadius: theme.radius.sm,
        color: "white",
        cursor: "pointer",
    },
    summaryCard: {
        background: theme.colors.card,
        padding: "20px",
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.border}`,
        marginTop: "20px",
    },
    expenseCard: {
        background: theme.colors.card,
        padding: "12px 16px",
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border}`,
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
    },
    deleteBtn: {
        background: "transparent",
        border: "none",
        color: "#e74c3c",
        cursor: "pointer",
        fontSize: "16px",
    },
    editBtn: {
        background: "transparent",
        border: "none",
        color: "#3498db",
        cursor: "pointer",
        fontSize: "16px"
    },
};