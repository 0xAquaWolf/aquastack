import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { authClient } from '@/lib/auth-client'
import AuthGuard from '@/components/AuthGuard'

export default function DashboardScreen() {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const handleLogout = async () => {
    await authClient.signOut()
    router.replace('/auth/login')
  }

  return (
    <AuthGuard>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.welcome}>
            Welcome,
            {session?.user?.name || 'User'}
            !
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Information</Text>
            <Text style={styles.cardText}>
              Email:
              {session?.user?.email}
            </Text>
            <Text style={styles.cardText}>
              User ID:
              {session?.user?.id}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Features</Text>
            <Text style={styles.cardText}>• View your profile</Text>
            <Text style={styles.cardText}>• Manage settings</Text>
            <Text style={styles.cardText}>• Access protected content</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </AuthGuard>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcome: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
