# everyThink Solar System

An interactive 3D solar system visualization for the everyThink platform, featuring customizable planets, smooth camera controls, and information panels.

![everyThink Solar System](https://github.com/simonfot/everyThink-solar-system-3D/raw/main/screenshots/solar-system.png)

## Features

- **Interactive 3D Solar System**: Navigate through a 3D representation of the everyThink ecosystem
- **Loading Screen**: Stylish loading animation while the 3D assets initialize
- **Camera Controls**: Free camera movement with lock/unlock functionality
- **Logo Mode**: Collapse the solar system into a compact logo for content viewing
- **Tooltips**: Hover over planets to view information
- **Responsive Design**: Works on desktop and mobile devices
- **Customizable Content**: Easy to configure with your own planets and information

## Updates

The latest version includes these improvements:

- Added a smooth loading screen that transitions into the 3D view
- Made orbit lines thicker and more visible, especially in logo mode
- Added free camera movement controls with arrow navigation
- Enhanced the tooltip system with expanded information panels
- Optimized performance for smoother interactions

## Controls

- **Reset View**: Return to the default camera position
- **Bird's Eye View**: View the solar system from above
- **Logo Mode**: Toggle between full-screen and compact logo view
- **Lock/Unlock Camera**: Toggle between automatic and free camera movement
- **Arrow Controls**: Navigate the camera when unlocked
- **Orbit Speed**: Adjust how fast planets orbit the center
- **Mouse/Touch**: Click and drag to rotate the view when camera is unlocked

## Customization

### Adding New Planets

To add new planets to the solar system, open `js/content.js` and add a new entry to the `PLANETS_DATA` array:

```javascript
{
    id: 'your-planet-id',
    name: 'Planet Name',
    description: 'Short description of the planet.',
    color: '#HEX_COLOR',
    size: 2.5,  // Relative size
    distance: 25,  // Distance from center
    orbitSpeed: 0.004,  // Speed of orbit
    rotationSpeed: 0.02,  // Speed of rotation
    type: 'project',  // Type (project, game, etc.)
    link: 'https://your-link.com',
    content: 'Detailed information about the planet.'
}
```

### Adding Moons

To add a moon orbiting around a planet, add an entry to the `MOONS_DATA` array:

```javascript
{
    id: 'moon-id',
    name: 'Moon Name',
    description: 'Description of the moon.',
    color: '#HEX_COLOR',
    size: 0.7,  // Relative size
    distance: 3,  // Distance from parent planet
    orbitSpeed: 0.025,  // Speed of orbit
    rotationSpeed: 0.04,  // Speed of rotation
    parentId: 'parent-planet-id',  // ID of parent planet
    link: '#',
    content: 'Detailed information about the moon.'
}
```

### Customizing Content Sections

Edit the `SECTIONS_CONTENT` object in `js/content.js` to modify the information displayed in the content panels.

## Technical Details

- Built with vanilla JavaScript and Three.js
- No dependencies other than Three.js and FontAwesome
- Responsive design adapts to different screen sizes
- Modular architecture for easy customization

## Implementation

### Directory Structure

```
everyThink-solar-system-3D/
├── css/
│   └── styles.css
├── js/
│   ├── content.js
│   ├── main.js
│   └── utils.js
├── index.html
└── README.md
```

### Key Components

- **index.html**: Main HTML structure
- **styles.css**: All styling for the application
- **content.js**: Configuration for planets, moons, and content sections
- **main.js**: Core 3D rendering and interaction logic
- **utils.js**: Utility functions for debugging and calculations

## Usage

1. Clone this repository
2. Open `index.html` in a web browser
3. Interact with the solar system using the controls

## Future Enhancements

- Mini-games hidden within the solar system
- User account integration with avatar customization
- Collaborative features for multiple users
- Mobile app version with AR capabilities

## Credits

- Three.js for 3D rendering
- FontAwesome for UI icons
- everyThink team for concept and design
