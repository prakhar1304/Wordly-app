"use client";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <LinearGradient
        colors={theme.primaryGradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>PK</Text>
          </View>
          <Text style={styles.name}>PRAKHAR MADHARIA</Text>
          <Text style={styles.email}>PK123@example.com</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="person-outline"
                size={24}
                color={theme.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Account Settings
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Notifications
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={theme.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Security
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="moon-outline"
                size={24}
                color={theme.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Dark Mode
              </Text>
            </View>
            <TouchableOpacity onPress={toggleTheme}>
              <View
                style={[
                  styles.toggleContainer,
                  { backgroundColor: isDark ? theme.primary : theme.border },
                ]}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    isDark && styles.toggleCircleActive,
                    { backgroundColor: "white" },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[styles.card, { backgroundColor: theme.card, marginTop: 20 }]}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={theme.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Help & Support
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={theme.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>
                About
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color={theme.error}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.error }]}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    width: "100%",
  },
  toggleContainer: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
});
