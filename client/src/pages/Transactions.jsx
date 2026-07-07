import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const DEFAULT_CATEGORIES = [
  "Food",
  "Groceries",
  "Rent",
  "Utilities",
  "Transport",
  "Entertainment",
  "Education",
  "Income",
  "Other",
];

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const getTransactionType = (category) => {
  return category === "Income" ? "income" : "expense";
};

const initialFormData = {
  name: "",
  amount: "",
  date: getTodayDate(),
  category: DEFAULT_CATEGORIES[0],
};

const inputClass =
  "w-full rounded-[10px] border border-[#e8ecf3] bg-white px-3 py-2.5 text-sm text-[#0a2540] outline-none transition focus:border-[#0a2540] focus:ring-2 focus:ring-[#0a2540]/10";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${BASE_URL}/categories`);

        const fetchedCategories = response.data.data.map((item) => {
          if (typeof item === "string") return item;
          return item.category;
        });

        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await axios.get(`${BASE_URL}/expenses`);

        const formattedTransactions = response.data.data.map((expense) => ({
          id: expense.expense_id,
          name: expense.description,
          category: expense.category,
          date: expense.created_date.split("T")[0],
          amount: Number(expense.amount),
          type: getTransactionType(expense.category),
        }));

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    }

    fetchTransactions();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Please enter a transaction name.";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      return "Please enter a valid amount.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setMessage(validationError);
      setMessageType("error");
      return;
    }

    const finalDate = formData.date || getTodayDate();
function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}
    const transaction = {
      user_id: 2,
      amount: Number(formData.amount),
      category: formData.category,
      description: toTitleCase(formData.name.trim()),
      created_date: finalDate,
    };

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await axios.post(`${BASE_URL}/api/expenses`, transaction);

      if (response.data.success) {
        const newTransaction = {
          id: response.data.newData?.expense_id || Date.now(),
          name: transaction.description,
          category: transaction.category,
          date: transaction.created_date,
          amount: transaction.amount,
          type: getTransactionType(transaction.category),
        };

        setTransactions((previousTransactions) => [
          newTransaction,
          ...previousTransactions,
        ]);

        setFormData({
          ...initialFormData,
          date: getTodayDate(),
        });

        setMessage("Transaction submitted successfully.");
        setMessageType("success");
      } else {
        setMessage(response.data.message || "Failed to submit transaction.");
        setMessageType("error");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to submit transaction due to a network error.");
      }

      setMessageType("error");
      console.error("Network write failure:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-6 font-sans text-[#0a2540] sm:px-7">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.8px]">
            Transactions
          </h1>
          <p className="mt-1 text-[13.5px] text-[#6b7a96]">
            Add and track your income and expenses.
          </p>
        </div>

        <div className="rounded-xl bg-white px-4 py-3 shadow-[0_4px_14px_rgba(10,37,64,0.04)]">
          <p className="text-xs font-bold uppercase tracking-wide text-[#6b7a96]">
            Total Records
          </p>
          <p className="text-xl font-extrabold">{transactions.length}</p>
        </div>
      </header>

      <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[380px_1fr]">
        <div className="rounded-2xl border border-[#0a2540]/[0.06] bg-white p-5 shadow-[0_4px_14px_rgba(10,37,64,0.04)]">
          <h2 className="mb-4 text-[15px] font-bold">Add Transaction</h2>

          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#6b7a96]">
                Name
              </label>
              <input
                className={inputClass}
                name="name"
                placeholder="e.g. Groceries"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#6b7a96]">
                Amount
              </label>
              <input
                className={inputClass}
                name="amount"
                type="number"
                min="1"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#6b7a96]">
                Date
              </label>
              <input
                className={inputClass}
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
              <p className="mt-1 text-xs text-[#9aa8c2]">
                If left empty, today&apos;s date will be used.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#6b7a96]">
                Category
              </label>
              <select
                className={inputClass}
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="mt-1 rounded-[10px] bg-[#0a2540] px-4 py-3 font-bold text-white transition hover:bg-[#12385f] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </button>

            {message && (
              <p
                className={`rounded-lg px-3 py-2 text-sm ${
                  messageType === "success"
                    ? "bg-green-50 text-[#1f9d55]"
                    : "bg-red-50 text-[#d23b3b]"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="rounded-2xl border border-[#0a2540]/[0.06] bg-white p-5 shadow-[0_4px_14px_rgba(10,37,64,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold">
              All Transactions ({transactions.length})
            </h2>
          </div>

          <div className="flex max-h-[640px] flex-col gap-1.5 overflow-y-auto pr-1">
            {transactions.length === 0 ? (
              <div className="rounded-xl bg-[#f6f8fc] p-6 text-center text-sm text-[#6b7a96]">
                No transactions found.
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 rounded-[11px] p-3 transition hover:bg-[#f6f8fc]"
                >
                  <div
                    className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] font-extrabold text-white ${
                      transaction.type === "income"
                        ? "bg-[#1f9d55]"
                        : "bg-[#d23b3b]"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {transaction.name}
                    </p>
                    <p className="text-xs text-[#9aa8c2]">
                      {transaction.category} ·{" "}
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className={`shrink-0 font-bold ${
                      transaction.type === "income"
                        ? "text-[#1f9d55]"
                        : "text-[#d23b3b]"
                    }`}
                  >
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TransactionsPage;