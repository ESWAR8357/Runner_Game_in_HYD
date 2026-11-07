/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameScene } from './components/game/GameScene';
import { HUD } from './components/ui/HUD';
import { MainMenu } from './components/ui/MainMenu';
import { PauseModal } from './components/ui/PauseModal';
import { GameOverModal } from './components/ui/GameOverModal';
import { TouchControls } from './components/ui/TouchControls';
import { OrientationPrompt } from './components/ui/OrientationPrompt';
import { useGameStore } from './store/gameStore';

export default function App() {
  const gameState = useGameStore((s) => s.gameState);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none touch-none">
      {/* 3D Game Canvas Engine */}
      <GameScene />

      {/* Gameplay HUD Overlay */}
      {gameState === 'PLAYING' && <HUD />}

      {/* Main Menu Screen */}
      {gameState === 'MENU' && <MainMenu />}

      {/* Pause Screen */}
      {gameState === 'PAUSED' && <PauseModal />}

      {/* Game Over Screen */}
      {gameState === 'GAME_OVER' && <GameOverModal />}

      {/* Mobile Landscape Orientation Recommendation */}
      <OrientationPrompt />

      {/* Global Keyboard, Touch Swipe & Virtual Controls */}
      <TouchControls />
    </main>
  );
}
