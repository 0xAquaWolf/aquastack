import React, { useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'expo-router'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      if (result.error) {
        Alert.alert('Login Failed', result.error.message || 'Invalid credentials')
      }
      else {
        // Navigate to dashboard on successful login
        router.replace('/dashboard')
      }
    }
    catch (error) {
      Alert.alert('Error', 'An unexpected error occurred')
      console.error('Login error:', error)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 justify-center bg-white px-5">
      <Text className="mb-2 text-center text-3xl font-bold text-gray-900">Welcome Back</Text>
      <Text className="mb-8 text-center text-base text-gray-600">Sign in to continue</Text>

      <TextInput
        className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity
        className={`mt-2 items-center rounded-lg py-4 ${isLoading ? 'bg-gray-300' : 'bg-blue-500'}`}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text className="text-base font-semibold text-white">
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6 items-center"
        onPress={() => router.push('/auth/signup')}
        disabled={isLoading}
      >
        <Text className="text-base text-blue-500">
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  )
}
