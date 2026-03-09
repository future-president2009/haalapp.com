// src/navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { colors } from '../styles/theme';
import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import SupportScreen from '../screens/SupportScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Temporary placeholder screens

const PatternsScreen = () => (
  <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: colors.textPrimary, fontSize: 18 }}>Pattern Lab</Text>
    <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8 }}>Coming in Phase 7!</Text>
  </View>
);

const DiscoveryScreen = () => (
  <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: colors.textPrimary, fontSize: 18 }}>Discovery Center</Text>
    <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8 }}>Psychology lessons coming soon!</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surfaceLight,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <View style={{ 
              width: 24, 
              height: 24, 
              backgroundColor: focused ? colors.primary : color,
              borderRadius: 12,
              opacity: focused ? 1 : 0.6
            }} />
          ),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarLabel: 'Riley',
          tabBarIcon: ({ focused, color }) => (
            <View style={{ 
              width: 24, 
              height: 24, 
              backgroundColor: focused ? colors.secondary : color,
              borderRadius: 12,
              opacity: focused ? 1 : 0.6
            }} />
          ),
        }}
      />
      <Tab.Screen 
        name="Patterns" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <View style={{ 
              width: 24, 
              height: 24, 
              backgroundColor: focused ? colors.accent : color,
              borderRadius: 12,
              opacity: focused ? 1 : 0.6
            }} />
          ),
        }}
      />
      <Tab.Screen 
        name="Support" 
        component={SupportScreen}
        options={{
          tabBarLabel: 'Support',
          tabBarIcon: ({ focused, color }) => (
            <View style={{ 
              width: 24, 
              height: 24, 
              backgroundColor: focused ? colors.success : color,
              borderRadius: 12,
              opacity: focused ? 1 : 0.6
            }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;