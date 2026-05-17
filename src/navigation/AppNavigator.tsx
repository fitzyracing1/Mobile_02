import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import { MainTabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import JourneyScreen from '../screens/JourneyScreen';
import MissionsScreen from '../screens/MissionsScreen';
import FactsScreen from '../screens/FactsScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: theme.colors.accent,
          background: theme.colors.background,
          card: theme.colors.backgroundSecondary,
          text: theme.colors.textPrimary,
          border: theme.colors.borderLight,
          notification: theme.colors.accent,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.backgroundSecondary,
            borderTopColor: theme.colors.borderLight,
            borderTopWidth: 1,
            paddingBottom: Platform.OS === 'ios' ? 0 : 8,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 84 : 64,
          },
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginBottom: Platform.OS === 'ios' ? 0 : 4,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Overview',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size ?? 22, color }}>🔴</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Journey"
          component={JourneyScreen}
          options={{
            tabBarLabel: 'Journey',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size ?? 22, color }}>🚀</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Missions"
          component={MissionsScreen}
          options={{
            tabBarLabel: 'Missions',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size ?? 22, color }}>🛸</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Facts"
          component={FactsScreen}
          options={{
            tabBarLabel: 'Mars Facts',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size ?? 22, color }}>📡</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
