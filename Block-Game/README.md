# Air Draw

A hand-gesture drawing app. Point your webcam at yourself, pinch your thumb
and index finger together, and draw in the air — the stroke shows up as a
glowing neon line on a flat, full-screen canvas over your camera feed. No 3D,
no grid — just a flat surface you draw on with your fingertip.

## Gestures

| Gesture        | Action              |
| -------------- | ------------------- |
| Open Palm      | Idle (pen up)        |
| Pinch          | Draw                 |
| Fist           | Erase                |
| Peace ✌️       | Undo last stroke     |
| Thumbs Up 👍   | Save drawing         |
| Thumbs Down 👎 | Clear the canvas     |

## Stack

- React 19 + Vite
- MediaPipe Hands for hand tracking (2 hands, 21 landmarks each)
- Plain 2D Canvas for drawing — no WebGL/Three.js
- Tailwind v4 for the HUD chrome

## Running it

```bash
npm install
npm run dev
```

Grant camera access when prompted, then hit **Start** in the control dock at
the bottom of the screen.
