import { Slot } from "expo-router";
import SafecScreen from "@/components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <SafecScreen>
                <Slot />
            </SafecScreen>
            <StatusBar style="dark" />
        </AuthProvider>
    );
}
