import { useCallback, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../constants/api";

export const useTransactions = (user_id) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert("Error", "Authentication token not found. Please sign in again.");
                return;
            }

            const response = await fetch(`${API_URL}/transactions/${user_id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const data = await response.json();
            setTransactions(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching transactions: ", error);
            Alert.alert("Error", "Failed to load transactions");
        }
    }, [user_id]);

    const fetchSummary = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert("Error", "Authentication token not found. Please sign in again.");
                return;
            }

            const response = await fetch(
                `${API_URL}/transactions/summary/${user_id}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch summary");
            }

            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error("Error fetching summary: ", error);
            Alert.alert("Error", "Failed to load summary");
        }
    }, [user_id]);

    const loadData = useCallback(async () => {
        if (!user_id) return;

        setIsLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.error("Error loading data: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary, user_id]);

    const deleteTransaction = async (id) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert("Error", "Authentication token not found. Please sign in again.");
                return;
            }

            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to delete transaction");

            loadData();
            Alert.alert("Success", "Transaction deleted successfully");
        } catch (error) {
            console.error("Error deleting transaction: ", error);
            Alert.alert("Error", error.message);
        }
    };

    return { transactions, summary, isLoading, loadData, deleteTransaction };
};
