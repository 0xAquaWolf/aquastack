import React, { useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'expo-router'

export default function SignupScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        Alert.alert('Signup Failed', result.error.message || 'Could not create account')
      }
      else {
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth/login'),
            },
          ],
        )
      }
    }
    catch (error) {
      Alert.alert('Error', 'An unexpected error occurred')
      console.error('Signup error:', error)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 justify-center bg-white px-5">
      <Text className="mb-2 text-center text-3xl font-bold text-gray-900">Create Account</Text>
      <Text className="mb-8 text-center text-base text-gray-600">Sign up to get started</Text>

      <TextInput
        className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base"
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        editable={!isLoading}
      />

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
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text className="text-base font-semibold text-white">
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6 items-center"
        onPress={() => router.push('/auth/login')}
        disabled={isLoading}
      >
        <Text className="text-base text-blue-500">
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  )
}
