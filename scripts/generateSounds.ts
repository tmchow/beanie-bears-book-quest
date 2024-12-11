import { writeFileSync } from 'fs';
import { Synth, now } from 'tone';

// Generate correct answer sound
const correctSound = () => {
  const synth = new Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.4 }
  }).toDestination();

  // Cheerful ascending notes - playful "ta-da"
  synth.triggerAttackRelease('G4', '8n', now());
  synth.triggerAttackRelease('C5', '8n', now() + 0.15);
  synth.triggerAttackRelease('E5', '8n', now() + 0.3);
};

// Generate incorrect answer sound
const incorrectSound = () => {
  const synth = new Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.4 }
  }).toDestination();

  // Gentle "aw" sound - two descending notes
  synth.triggerAttackRelease('E4', '8n', now());
  setTimeout(() => {
    synth.triggerAttackRelease('C4', '8n', now() + 0.2);
  }, 200);
};

// Generate and save the sounds
correctSound();
incorrectSound(); 