/**
 * Content configuration for the everyThink solar system
 * This file defines the planets, their properties, and content
 */

// Planet data
const PLANETS_DATA = [
    {
        id: 'sun',
        name: 'EveryThink',
        description: 'The central hub that connects all projects and concepts in the ecosystem.',
        color: '#FFD700',
        size: 5,
        distance: 0,
        orbitSpeed: 0,
        rotationSpeed: 0.001,
        type: 'central',
        link: 'https://everyThink.world',
        content: 'EveryThink is a decentralized ecosystem for creativity, collaboration, and community building. It serves as the central connection point for all our projects and initiatives.'
    },
    {
        id: 'cueup',
        name: 'CueUp',
        description: 'Music creation and collaboration platform.',
        color: '#FF6347',
        size: 2.5,
        distance: 12,
        orbitSpeed: 0.005,
        rotationSpeed: 0.02,
        type: 'project',
        link: 'https://cueup.io',
        content: 'CueUp is a platform for music creation and collaboration, connecting producers, artists, and listeners in a seamless ecosystem.'
    },
    {
        id: 'unit3',
        name: 'UNIT3',
        description: 'Community hub for sustainable creativity.',
        color: '#4CAF50',
        size: 3,
        distance: 20,
        orbitSpeed: 0.003,
        rotationSpeed: 0.015,
        type: 'project',
        link: 'https://unit3.co',
        content: 'UNIT3 is a physical and digital space for sustainable creativity, hosting workshops, events, and a community-driven marketplace.'
    },
    {
        id: 'fot',
        name: 'FoT',
        description: 'Fear of Thinking - Creative exploration and philosophy.',
        color: '#9C27B0',
        size: 2,
        distance: 30,
        orbitSpeed: 0.002,
        rotationSpeed: 0.025,
        type: 'project',
        link: 'https://fearofthinking.com',
        content: 'Fear of Thinking (FoT) explores the intersection of art, philosophy, and technology, challenging conventional perspectives and fostering creative thinking.'
    },
    {
        id: 'game1',
        name: 'Rhythm Racer',
        description: 'Interactive rhythm-based racing game.',
        color: '#2196F3',
        size: 1.5,
        distance: 38,
        orbitSpeed: 0.006,
        rotationSpeed: 0.03,
        type: 'game',
        link: '#',
        content: 'Rhythm Racer is an immersive game that combines music and racing, creating a unique experience where your performance is tied to the rhythm of the soundtrack.'
    },
    {
        id: 'game2',
        name: 'Avatar Arena',
        description: 'Competitive avatar battles with custom skills.',
        color: '#FFC107',
        size: 1.7,
        distance: 45,
        orbitSpeed: 0.007,
        rotationSpeed: 0.035,
        type: 'game',
        link: '#',
        content: 'Avatar Arena lets you compete with customized avatars, each with unique abilities and skills that can be upgraded through gameplay and community participation.'
    }
];

// Moon data (sub-projects)
const MOONS_DATA = [
    {
        id: 'unit3-cafe',
        name: 'U3 Café',
        description: 'Sustainable coffee shop within UNIT3.',
        color: '#8BC34A',
        size: 0.8,
        distance: 2,
        orbitSpeed: 0.02,
        rotationSpeed: 0.05,
        parentId: 'unit3',
        link: '#',
        content: 'U3 Café serves sustainably sourced coffee and food, creating a community gathering space within the UNIT3 hub.'
    },
    {
        id: 'unit3-shop',
        name: 'U3 Shop',
        description: 'Curated marketplace for sustainable products.',
        color: '#CDDC39',
        size: 0.7,
        distance: 3,
        orbitSpeed: 0.025,
        rotationSpeed: 0.04,
        parentId: 'unit3',
        link: '#',
        content: 'U3 Shop features products from local creators and sustainable brands, supporting ethical consumption and community-based economics.'
    },
    {
        id: 'fot-clothing',
        name: 'FoT Apparel',
        description: 'Limited edition clothing and accessories.',
        color: '#E91E63',
        size: 0.6,
        distance: 2.2,
        orbitSpeed: 0.03,
        rotationSpeed: 0.06,
        parentId: 'fot',
        link: '#',
        content: 'FoT Apparel offers limited edition clothing and accessories that explore philosophical concepts through visual design and ethical production methods.'
    }
];

// Content for sections
const SECTIONS_CONTENT = {
    about: {
        title: 'About EveryThink',
        content: `
            <p>EveryThink is a platform that allows you to create your own thoughtverse - a solar system of ideas, projects, and connections.</p>
            <p>Each planet represents a different project or idea, orbiting around your central concept.</p>
            <p>Navigate through the solar system to explore different aspects of the ecosystem and discover how everything is connected.</p>
            <h3>Key Features</h3>
            <ul>
                <li>Interactive 3D navigation</li>
                <li>Connect your projects in a visual way</li>
                <li>Earn rewards for engagement and creativity</li>
                <li>Explore and collaborate with others</li>
            </ul>
        `
    },
    'physical-digital': {
        title: 'Physical & Digital',
        content: `
            <p>EveryThink exists both physically and digitally, creating a seamless connection between online and offline experiences.</p>
            <p>Physical tokens and coins can be scanned to access digital content, and digital achievements can be redeemed for physical rewards.</p>
            <div class="qr-code">
                <div class="qr-placeholder"></div>
                <p>Scan to connect your physical token</p>
            </div>
            <h3>Bridging Worlds</h3>
            <p>The boundary between physical and digital is increasingly blurred. EveryThink embraces this convergence, creating experiences that flow between both realms.</p>
        `
    },
    'earning-spending': {
        title: 'Earning & Spending',
        content: `
            <p>Earn points by engaging with the platform and redeem them for real-world rewards.</p>
            <h3>Ways to Earn</h3>
            <ul class="rewards-list">
                <li>Creating content in your Thoughtverse</li>
                <li>Completing challenges and games</li>
                <li>Attending events at UNIT3</li>
                <li>Contributing to community projects</li>
            </ul>
            <h3>Redeem For</h3>
            <ul class="rewards-list">
                <li>Free coffee at Unit3</li>
                <li>Exclusive FoT merchandise</li>
                <li>Digital collectibles</li>
                <li>Early access to new features</li>
                <li>Limited edition physical coins</li>
            </ul>
        `
    }
};
