[README.md](https://github.com/user-attachments/files/22666991/README.md)
# 🪙 Coin Catcher Game 🐷

A fun 2D browser-based game where you control a piggy bank to catch falling coins!

## 🎮 How to Play

1. **Open the game**: Double-click on `index.html` or open it in your web browser
2. **Move the piggy bank**: Use the **←** and **→** arrow keys to move left and right
3. **Catch coins**: Position your piggy bank under falling coins to collect them
4. **Score points**: Each coin caught gives you 10 points
5. **Challenge yourself**: The game gets faster as you collect more coins!

## ✨ Features

- **Cute piggy bank character** with animated eyes and snout
- **Rotating golden coins** with dollar signs
- **Smooth keyboard controls** for precise movement
- **Progressive difficulty** - game speed increases with score
- **Beautiful graphics** with gradient backgrounds and floating clouds
- **Real-time score tracking**
- **Game over screen** with restart option
- **Modern UI design** with glass-morphism effects

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or installations required!

### Running the Game
1. Download or clone this repository
2. Navigate to the project folder
3. Open `index.html` in your web browser
4. Start playing immediately!

## 📁 Project Structure

```
coin-catcher-game/
├── index.html          # Main HTML file with game canvas and UI
├── game.js            # JavaScript game logic and mechanics
└── README.md          # This documentation file
```

## 🎯 Game Mechanics

- **Piggy Bank**: Pink character that moves horizontally across the bottom of the screen
- **Coins**: Golden coins that fall from random positions at the top
- **Collision Detection**: Precise hit detection between piggy bank and coins
- **Scoring System**: 10 points per coin collected
- **Speed Progression**: Game speed increases by 0.01x for each coin collected

## 🎨 Technical Details

- **Built with**: HTML5 Canvas and vanilla JavaScript
- **Performance**: 60fps smooth gameplay
- **Responsive**: Works on desktop and mobile browsers
- **No Dependencies**: Pure HTML, CSS, and JavaScript

## 🛠️ Customization

Want to modify the game? Here are some easy customizations:

- **Change coin value**: Modify the score increment in `game.js` line 200
- **Adjust difficulty**: Change the spawn rate in `spawnCoin()` function
- **Modify colors**: Update the color values in the drawing functions
- **Add sound effects**: Include audio files and play them on collision

## 🎉 Have Fun!

Enjoy catching those coins and see how high you can score! The game is designed to be simple to learn but challenging to master as the speed increases.

---

*Made with ❤️ using HTML5 Canvas and JavaScript*
