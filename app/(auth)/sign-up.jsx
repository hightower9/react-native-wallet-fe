import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "@/assets/styles/auth.styles.js";
import { COLORS } from "@/constants/colors.js";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "@/context/AuthContext";

export default function SignUpScreen() {
    const { signUp } = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            const result = await signUp(name, emailAddress, password);
            
            if (result.success) {
                setSuccess(true);
                // You can redirect to sign-in page or show success message
                setTimeout(() => {
                    router.replace("/sign-in");
                }, 2000);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Something went wrong, please try again.");
            console.error("Sign Up Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <View style={styles.verificationContainer}>
                <View style={styles.successBox}>
                    <Ionicons
                        name="checkmark-circle"
                        size={60}
                        color={COLORS.success || "#4CAF50"}
                    />
                    <Text style={styles.verificationTitle}>Account Created!</Text>
                    <Text style={styles.successText}>
                        Your account has been created successfully. Redirecting to sign in...
                    </Text>
                </View>
            </View>
        );
    }

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
                    source={require("../../assets/images/revenue-i2.png")}
                    style={styles.illustration}
                />
                <Text style={styles.title}>Create Account</Text>
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
                    value={name}
                    placeholderTextColor="#9A8478"
                    placeholder="Enter name"
                    onChangeText={(name) => setName(name)}
                    editable={!loading}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholderTextColor="#9A8478"
                    placeholder="Enter email"
                    onChangeText={(email) => setEmailAddress(email)}
                    editable={!loading}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholderTextColor="#9A8478"
                    placeholder="Enter password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    editable={!loading}
                />
                <TouchableOpacity 
                    style={[styles.button, loading && { opacity: 0.6 }]} 
                    onPress={onSignUpPress}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.linkText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}