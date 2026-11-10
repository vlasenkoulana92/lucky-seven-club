import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StatusBar, StyleSheet, View } from 'react-native';

import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import ChallengeScreen from './src/screens/ChallengeScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import DailyModeScreen from './src/screens/DailyModeScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import { GameStateProvider, useSettings } from './src/hooks/useGameState';
import { ResultPayload } from './src/game/result';
import { COLORS } from './src/constants/theme';
import { FADE_SCREEN_MS, motionMs } from './src/constants/config';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'result'
  | 'challenge'
  | 'progress'
  | 'collection'
  | 'daily'
  | 'settings';

function Root() {
  const settings = useSettings();
  const [screen, setScreen] = useState<Screen>('loader');
  const [result, setResult] = useState<ResultPayload | null>(null);

  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const screenRef = useRef<Screen>('loader');
  screenRef.current = screen;

  const duration = motionMs(FADE_SCREEN_MS, settings.reduceMotion);

  const go = useCallback(
    (next: Screen) => {
      if (next === screenRef.current) {
        return;
      }
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration: duration / 2, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 12, duration: duration / 2, useNativeDriver: true }),
      ]).start(() => {
        setScreen(next);
        slide.setValue(-12);
        Animated.parallel([
          Animated.timing(fade, { toValue: 1, duration: duration / 2, useNativeDriver: true }),
          Animated.timing(slide, { toValue: 0, duration: duration / 2, useNativeDriver: true }),
        ]).start();
      });
    },
    [duration, fade, slide],
  );

  // System Back mirrors the forward route; Back on Menu closes the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = screenRef.current;
      if (current === 'menu' || current === 'loader') {
        return false;
      }
      go('menu');
      return true;
    });
    return () => sub.remove();
  }, [go]);

  const openResult = useCallback(
    (payload: ResultPayload) => {
      setResult(payload);
      go('result');
    },
    [go],
  );

  const replay = useCallback(() => {
    const target = result ? result.replay : 'game';
    go(target as Screen);
  }, [go, result]);

  let body: React.ReactNode = null;
  if (screen === 'loader') {
    body = <LoaderScreen onDone={() => go('menu')} />;
  } else if (screen === 'menu') {
    body = (
      <MenuScreen
        onPlay={() => go('game')}
        onChallenge={() => go('challenge')}
        onDaily={() => go('daily')}
        onCollection={() => go('collection')}
        onProgress={() => go('progress')}
        onSettings={() => go('settings')}
      />
    );
  } else if (screen === 'game') {
    body = <GameScreen onHome={() => go('menu')} onGameOver={openResult} />;
  } else if (screen === 'result' && result) {
    body = (
      <ResultScreen
        payload={result}
        onPlayAgain={replay}
        onMenu={() => go('menu')}
        onCollection={() => go('collection')}
      />
    );
  } else if (screen === 'challenge') {
    body = <ChallengeScreen onHome={() => go('menu')} onFinish={openResult} />;
  } else if (screen === 'daily') {
    body = <DailyModeScreen onHome={() => go('menu')} onFinish={openResult} />;
  } else if (screen === 'progress') {
    body = <ProgressScreen onHome={() => go('menu')} />;
  } else if (screen === 'collection') {
    body = <CollectionScreen onHome={() => go('menu')} />;
  } else if (screen === 'settings') {
    body = <SettingsScreen onHome={() => go('menu')} />;
  } else {
    body = (
      <MenuScreen
        onPlay={() => go('game')}
        onChallenge={() => go('challenge')}
        onDaily={() => go('daily')}
        onCollection={() => go('collection')}
        onProgress={() => go('progress')}
        onSettings={() => go('settings')}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.layer, { opacity: fade, transform: [{ translateY: slide }] }]}>
        {body}
      </Animated.View>
    </View>
  );
}

export default function App() {
  return (
    <GameStateProvider>
      <Root />
    </GameStateProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
  layer: {
    flex: 1,
  },
});
