import * as Tone from 'tone';

class AudioManager {
  private correctSynth: Tone.Synth | null = null;
  private incorrectSynth: Tone.Synth | null = null;
  private initialized: boolean = false;

  private async ensureInitialized() {
    if (this.initialized) return;
    
    try {
      // Only initialize after user interaction
      await Tone.start();
      
      this.correctSynth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.05,
          decay: 0.2,
          sustain: 0.2,
          release: 0.5
        }
      }).toDestination();
      this.correctSynth.volume.value = -10;

      this.incorrectSynth = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.05,
          decay: 0.2,
          sustain: 0.2,
          release: 0.5
        }
      }).toDestination();
      this.incorrectSynth.volume.value = -10;

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  async playCorrect() {
    try {
      await this.ensureInitialized();
      if (!this.correctSynth) return;
      
      const now = Tone.now();
      this.correctSynth.triggerAttackRelease("C5", "8n", now);
      this.correctSynth.triggerAttackRelease("E5", "8n", now + 0.1);
      this.correctSynth.triggerAttackRelease("G5", "8n", now + 0.2);
    } catch (error) {
      console.error('Error playing correct sound:', error);
    }
  }

  async playIncorrect() {
    try {
      await this.ensureInitialized();
      if (!this.incorrectSynth) return;
      
      const now = Tone.now();
      this.incorrectSynth.triggerAttackRelease("E4", "8n", now);
      this.incorrectSynth.triggerAttackRelease("Eb4", "8n", now + 0.2);
    } catch (error) {
      console.error('Error playing incorrect sound:', error);
    }
  }
}

const audioManager = new AudioManager();
export default audioManager; 