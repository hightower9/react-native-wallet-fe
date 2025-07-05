import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useState } from "react";
import { styles } from "@/assets/styles/auth.styles.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS } from "@/constants/colors.js";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
    const { signIn } = useAuth();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (loading) return;

        setLoading(true);
        setError("");
console.log(emailAddress, password)
        try {
            const result = await signIn(emailAddress, password);
            console.log(result)
            if (result.success) {
                router.replace("/");
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Something went wrong, please try again.");
            console.error("Error signing in:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={50}
        >
            <View style={styles.container}>
                <Image
                    source={require("../../assets/images/revenue-i4.png")}
                    style={styles.illustration}
                />
                <Text style={styles.title}>Welcome Back</Text>
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons
                            name="alert-circle"
                            size={20}
                            color={COLORS.expense}
                        />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError("")}>
                            <Ionicons
                                name="close"
                                size={20}
                                color={COLORS.textLight}
                            />
                        </TouchableOpacity>
                    </View>
                ) : null}
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#9A8478"
                    onChangeText={(emailAddress) =>
                        setEmailAddress(emailAddress)
                    }
                    editable={!loading}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry={true}
                    placeholderTextColor="#9A8478"
                    onChangeText={(password) => setPassword(password)}
                    editable={!loading}
                />
                <TouchableOpacity 
                    style={[styles.button, loading && { opacity: 0.6 }]} 
                    onPress={onSignInPress}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Signing In..." : "Sign In"}
                    </Text>
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        Don&apos;t have an account?
                    </Text>
                    <Link href="/sign-up" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}