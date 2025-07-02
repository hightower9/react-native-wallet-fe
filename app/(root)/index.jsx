import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "@/hooks/useTransactions";
import { useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";
import { styles } from "@/assets/styles/home.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem } from "@/components/TransactionItem";
import { NoTransactionFound } from "@/components/NoTransactionFound";

export default function Page() {
    const { user } = useUser();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const { transactions, summary, isLoading, loadData, deleteTransaction } =
        useTransactions(user.id);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => deleteTransaction(id),
                    style: "destructive",
                },
            ]
        );
    };

    if (isLoading && !refreshing) return <PageLoader />;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    {/* Left */}
                    <View style={styles.headerLeft}>
                        <Image
                            source={require("../../assets/images/logo.png")}
                            style={styles.headerLogo}
                            contentFit="contain"
                        />
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeText}>Welcome, </Text>
                            <Text style={styles.usernameText}>
                                {
                                    user?.emailAddresses[0]?.emailAddress.split(
                                        "@"
                                    )[0]
                                }
                            </Text>
                        </View>
                    </View>
                    {/* Right */}
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push("/create")}
                        >
                            <Ionicons name="add" size={20} color="#FFF" />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                        <SignOutButton />
                    </View>
                </View>

                {/* Summary */}
                <BalanceCard summary={summary} />

                {/* Transactions */}
                <View style={styles.transactionsHeaderContainer}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                </View>
            </View>

            {/* Flatlist is a performant way to render long lists in react native. */}
            {/* it renders items lazily - only those on the screen. */}
            <FlatList
                style={styles.transactionsList}
                contentContainerStyle={styles.transactionsListContent}
                data={transactions}
                renderItem={({ item }) => (
                    <TransactionItem item={item} onDelete={handleDelete} />
                )}
                ListEmptyComponent={<NoTransactionFound />}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
}
