import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import SafecScreen from "@/components/SafeScreen";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    return (
        <ClerkProvider tokenCache={tokenCache}>
            <SafecScreen>
                <Slot />
            </SafecScreen>
            <StatusBar style="dark" />
        </ClerkProvider>
    );
}
