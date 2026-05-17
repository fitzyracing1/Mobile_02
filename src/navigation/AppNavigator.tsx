import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import { RootStackParamList, MainTabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ActiveRunScreen from '../screens/ActiveRunScreen';
import RunDetailScreen from '../screens/RunDetailScreen';
import { COLORS, FONT_SIZES } from '../theme';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 0 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size ?? 22, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size ?? 22, color }}>📋</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: COLORS.accent,
          background: COLORS.background,
          card: COLORS.surface,
          text: COLORS.textPrimary,
          border: COLORS.border,
          notification: COLORS.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
          presentation: 'card',
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="ActiveRun"
          component={ActiveRunScreen}
          options={{
            presentation: 'modal',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="RunDetail" component={RunDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
