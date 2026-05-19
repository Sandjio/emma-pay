import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";
import type { ApiTransaction } from "./api";
import { formatCurrency, transactionTitle } from "./format";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

type NotificationsModule = typeof import("expo-notifications");
let Notifications: NotificationsModule | null = null;

if (!isExpoGo) {
  try {
    // Loaded lazily so Expo Go on SDK 53+ doesn't crash on the package's
    // push-token auto-registration side effect.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Notifications = require("expo-notifications") as NotificationsModule;
  } catch {
    Notifications = null;
  }
}

let configured = false;

export function configureNotifications() {
  if (configured || !Notifications) return;
  configured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("transactions", {
      name: "Transactions",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 120, 80, 120],
      lightColor: "#2563EB",
    }).catch(() => {});
  }
}

type PermissionShape = { status: "granted" | "denied" | "undetermined" };

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Notifications) return false;
  const current = (await Notifications.getPermissionsAsync()) as unknown as PermissionShape;
  if (current.status === "granted") return true;
  if (current.status === "denied") return false;
  const result = (await Notifications.requestPermissionsAsync()) as unknown as PermissionShape;
  return result.status === "granted";
}

function buildTitle(t: ApiTransaction): string {
  const amount = formatCurrency(t.amount, t.currency);
  switch (t.type) {
    case "TOPUP":
      return `${amount} added`;
    case "WITHDRAW":
      return `${amount} withdrawn`;
    case "SEND":
      return `${amount} sent`;
    case "RECEIVE":
      return `${amount} received`;
    default:
      return `${amount}`;
  }
}

function buildBody(t: ApiTransaction): string {
  if (t.bankAccount) {
    if (t.type === "TOPUP")
      return `From ${t.bankAccount.institutionName} ••${t.bankAccount.lastFour}`;
    if (t.type === "WITHDRAW")
      return `To ${t.bankAccount.institutionName} ••${t.bankAccount.lastFour}`;
  }
  if (t.counterpartyName) {
    if (t.type === "SEND") return `To ${t.counterpartyName}`;
    if (t.type === "RECEIVE") return `From ${t.counterpartyName}`;
  }
  return transactionTitle(t);
}

export async function notifyTransaction(t: ApiTransaction): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: buildTitle(t),
        body: buildBody(t),
        data: { txnId: t.id, type: t.type },
        ...(Platform.OS === "android" ? { channelId: "transactions" } : {}),
      },
      trigger: null,
    });
  } catch {
    // notifications are best-effort; never break the flow
  }
}
