import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Platform } from 'react-native';
import { MainTabParamList, MissionsStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import JourneyScreen from '../screens/JourneyScreen';
import MissionsScreen from '../screens/MissionsScreen';
import MissionDetailScreen from '../screens/MissionDetailScreen';
import FactsScreen from '../screens/FactsScreen';
import QuizScreen from '../screens/QuizScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

type FactsStackParamList = {
  FactsHome: undefined;
  Quiz: undefined;
};

const FactsStack = createNativeStackNavigator<FactsStackParamList>();

function FactsStackNavigator() {
  return (
    <FactsStack.Navigator screenOptions={{ headerShown: false }}>
      <FactsStack.Screen name="FactsHome" component={FactsScreen} />
      <FactsStack.Screen name="Quiz" component={QuizScreen} />
    </FactsStack.Navigator>
  );
}

const MissionsStack = createNativeStackNavigator<MissionsStackParamList>();

function MissionsStackNavigator() {
  return (
    <MissionsStack.Navigator screenOptions={{ headerShown: false }}>
      <MissionsStack.Screen name="MissionsList" component={MissionsScreen} />
      <MissionsStack.Screen name="MissionDetail" component={MissionDetailScreen} />
    </MissionsStack.Navigator>
  );
}

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
          component={MissionsStackNavigator}
          options={{
            tabBarLabel: 'Missions',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size ?? 22, color }}>🛸</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Facts"
          component={FactsStackNavigator}
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
