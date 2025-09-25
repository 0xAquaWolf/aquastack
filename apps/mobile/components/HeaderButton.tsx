import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Pressable, StyleSheet } from 'react-native'

export function HeaderButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <FontAwesome
          name="info-circle"
          size={25}
          color="gray"
          style={[
            styles.headerRight,
            {
              opacity: pressed ? 0.5 : 1,
            },
          ]}
        />
      )}
    </Pressable>
  )
}

HeaderButton.displayName = 'HeaderButton'

export const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
})
