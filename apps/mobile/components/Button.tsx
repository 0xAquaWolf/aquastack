import type { TouchableOpacityProps, View } from 'react-native'
import { Text, TouchableOpacity } from 'react-native'

type ButtonProps = {
  title: string
} & TouchableOpacityProps

export function Button({ ref, title, ...touchableProps }: ButtonProps & { ref?: React.RefObject<View | null> }) {
  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      className={`${styles.button} ${touchableProps.className}`}
    >
      <Text className={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

Button.displayName = 'Button'

const styles = {
  button: 'items-center bg-indigo-500 rounded-[28px] shadow-md p-4',
  buttonText: 'text-white text-lg font-semibold text-center',
}
