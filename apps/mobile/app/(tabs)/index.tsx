import { Stack } from 'expo-router';

import { View } from 'react-native';

import { Button } from '~/components/Button';
import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View className={styles.container}>
        <Button title="Hello World" />
        <ScreenContent path="app/(tabs)/index.tsx" title="Tab One" />
      </View>
    </>
  );
}

const styles = {
  container: 'flex p-[24px] h-full w-full',
};
