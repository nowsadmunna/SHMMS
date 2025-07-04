import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { API_URL } from "../redux/export_url";

export default function Expense() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await fetch(`${API_URL}/api/expense/get_all_expense`);
        const data = await res.json();
        if(data.success === false) {
          setError('Expense list not found');
          setExpenses([]);
        } else {
          setExpenses(data.expenseList);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Failed to fetch expenses. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  // Function to format currency
  const formatCurrency = (amount) => {
    return `${amount} BDT`;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-20">
        <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
        <p className="text-blue-600 text-lg font-medium animate-pulse">Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Expenses
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View your complete expense history
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            {error}
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100 h-fit">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-2xl bg-blue-100 mr-4">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 pt-2">Expense Summary</h2>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5 mb-4">
              <p className="text-gray-700">Track and analyze all your hostel expenses in one place.</p>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
                <span className="text-gray-700">Total Expenses</span>
                <span className="font-bold text-indigo-600">
                  {formatCurrency(expenses.reduce((sum, exp) => sum + exp.totalPrice, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-gray-700">Most Recent</span>
                <span className="font-bold text-purple-600">
                  {expenses.length > 0 
                    ? new Date(expenses[0].date).toLocaleDateString() 
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel - Expenses List */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Expense History</h2>
            </div>
            
            {expenses.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">No Expenses Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  There are no expenses available in your history.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {expenses.map((expense, index) => (
                  <div
                    key={expense._id}
                    className="p-4 rounded-xl flex justify-between items-center hover:bg-blue-50 cursor-pointer transition-all duration-200 border border-blue-50 group"
                    onClick={() => navigate(`/view_expense_details/${expense._id}`)}
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm md:text-base">
                          {new Date(expense.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(expense.date).toLocaleDateString(undefined, {
                            weekday: 'long'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-blue-600">{formatCurrency(expense.totalPrice)}</span>
                      <div className="bg-blue-100 rounded-full p-2 group-hover:bg-blue-200 transition-colors">
                        <ArrowRight className="h-4 w-4 text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}