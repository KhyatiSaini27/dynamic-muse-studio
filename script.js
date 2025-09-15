// Application State
let state = {
  gravity: false,
  spinning: false,
  exploded: false,
  floating: true,
  colorScheme: 'default',
  raining: false
};

let rainDrops = [];

// Playground Elements Data
const elements = [
  { id: '1', type: 'circle', size: 'md', x: 20, y: 30 },
  { id: '2', type: 'square', size: 'lg', x: 70, y: 20 },
  { id: '3', type: 'triangle', size: 'sm', x: 40, y: 60 },
  { id: '4', type: 'circle', size: 'sm', x: 80, y: 70 },
  { id: '5', type: 'square', size: 'md', x: 10, y: 80 },
  { id: '6', type: 'triangle', size: 'lg', x: 60, y: 40 },
];

// Suggested Commands
const suggestedCommands = [
  "turn off gravity",
  "make it rain",
  "change colors to purple",
  "spin everything",
  "explode",
  "reset"
];

// Color Schemes
const colorSchemes = {
  default: ['hsl(180, 100%, 50%)', 'hsl(270, 100%, 50%)', 'hsl(120, 100%, 50%)'],
  purple: ['hsl(270, 100%, 50%)', 'hsl(300, 100%, 50%)', 'hsl(240, 100%, 50%)'],
  red: ['hsl(0, 100%, 50%)', 'hsl(330, 100%, 50%)', 'hsl(15, 100%, 50%)'],
  blue: ['hsl(200, 100%, 50%)', 'hsl(240, 100%, 50%)', 'hsl(180, 100%, 50%)'],
  green: ['hsl(120, 100%, 50%)', 'hsl(150, 100%, 50%)', 'hsl(90, 100%, 50%)']
};

// DOM Elements
let playground, commandInput, submitBtn, feedbackDisplay, feedbackText, statusIndicators;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  playground = document.getElementById('playground');
  commandInput = document.getElementById('command-input');
  submitBtn = document.getElementById('submit-btn');
  feedbackDisplay = document.getElementById('feedback-display');
  feedbackText = document.getElementById('feedback-text');
  statusIndicators = document.getElementById('status-indicators');

  // Initialize components
  initializeCommandInterface();
  initializePlayground();
  updateStatusIndicators();
});

// Command Interface
function initializeCommandInterface() {
  const commandForm = document.getElementById('command-form');
  const suggestedCommandsContainer = document.getElementById('suggested-commands');

  // Handle form submission
  commandForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const command = commandInput.value.trim();
    if (command) {
      processCommand(command);
      showFeedback(`Executing: ${command}`);
      commandInput.value = '';
    }
  });

  // Create suggested command buttons
  suggestedCommands.forEach(cmd => {
    const button = document.createElement('button');
    button.textContent = cmd;
    button.className = 'command-suggestion';
    button.addEventListener('click', () => {
      commandInput.value = cmd;
    });
    suggestedCommandsContainer.appendChild(button);
  });
}

// Process Commands
function processCommand(cmd) {
  const lowerCmd = cmd.toLowerCase();
  
  if (lowerCmd.includes('turn off gravity') || lowerCmd.includes('no gravity')) {
    state.gravity = false;
    state.floating = true;
  } else if (lowerCmd.includes('turn on gravity') || lowerCmd.includes('gravity on')) {
    state.gravity = true;
    state.floating = false;
  } else if (lowerCmd.includes('spin') || lowerCmd.includes('rotate')) {
    state.spinning = !state.spinning;
  } else if (lowerCmd.includes('explode') || lowerCmd.includes('scatter')) {
    state.exploded = true;
    setTimeout(() => {
      state.exploded = false;
      updatePlaygroundElements();
    }, 2000);
  } else if (lowerCmd.includes('make it rain') || lowerCmd.includes('rain')) {
    createRain();
  } else if (lowerCmd.includes('reset') || lowerCmd.includes('clear')) {
    state = {
      gravity: false,
      spinning: false,
      exploded: false,
      floating: true,
      colorScheme: 'default',
      raining: false
    };
    clearRain();
  } else if (lowerCmd.includes('change colors to') || lowerCmd.includes('color')) {
    if (lowerCmd.includes('purple')) state.colorScheme = 'purple';
    else if (lowerCmd.includes('red')) state.colorScheme = 'red';
    else if (lowerCmd.includes('blue')) state.colorScheme = 'blue';
    else if (lowerCmd.includes('green')) state.colorScheme = 'green';
  }

  updatePlaygroundElements();
  updateStatusIndicators();
}

// Playground Management
function initializePlayground() {
  elements.forEach(element => {
    createPlaygroundElement(element);
  });
}

function createPlaygroundElement(elementData) {
  const element = document.createElement('div');
  element.id = `element-${elementData.id}`;
  element.className = `playground-element element-${elementData.size} element-${elementData.type}`;
  element.style.left = `${elementData.x}%`;
  element.style.top = `${elementData.y}%`;
  
  updateElementAppearance(element, elementData);
  playground.appendChild(element);
}

function updateElementAppearance(element, elementData) {
  const color = getElementColor(elementData.id);
  element.style.backgroundColor = color;
  element.style.boxShadow = `0 0 20px ${color}`;
}

function getElementColor(elementId) {
  const colors = colorSchemes[state.colorScheme] || colorSchemes.default;
  const index = parseInt(elementId) % colors.length;
  return colors[index];
}

function updatePlaygroundElements() {
  elements.forEach(elementData => {
    const element = document.getElementById(`element-${elementData.id}`);
    if (element) {
      // Update color
      updateElementAppearance(element, elementData);
      
      // Update physics classes
      element.className = `playground-element element-${elementData.size} element-${elementData.type}`;
      
      if (state.floating && !state.exploded) {
        element.classList.add('floating-element');
      }
      
      if (!state.gravity && !state.floating) {
        element.classList.add('physics-disabled');
      }
      
      if (state.spinning) {
        element.classList.add('spinning');
      }
      
      if (state.exploded) {
        element.classList.add('exploded');
        // Set random explosion direction
        const randomX = (Math.random() - 0.5) * 400;
        const randomY = (Math.random() - 0.5) * 400;
        element.style.setProperty('--random-x', `${randomX}px`);
        element.style.setProperty('--random-y', `${randomY}px`);
      }
    }
  });
}

// Rain Effect
function createRain() {
  const drops = Array.from({ length: 20 }, (_, i) => ({
    id: `rain-${i}`,
    x: Math.random() * 100,
    delay: Math.random() * 2000
  }));
  
  rainDrops = drops;
  state.raining = true;

  drops.forEach(drop => {
    const rainDrop = document.createElement('div');
    rainDrop.id = drop.id;
    rainDrop.className = 'rain-drop raining';
    rainDrop.style.left = `${drop.x}%`;
    rainDrop.style.animationDelay = `${drop.delay}ms`;
    playground.appendChild(rainDrop);
  });

  setTimeout(() => {
    clearRain();
    state.raining = false;
    updateStatusIndicators();
  }, 5000);
}

function clearRain() {
  rainDrops.forEach(drop => {
    const element = document.getElementById(drop.id);
    if (element) {
      element.remove();
    }
  });
  rainDrops = [];
}

// Status Indicators
function updateStatusIndicators() {
  statusIndicators.innerHTML = '';

  // Gravity indicator
  const gravityIndicator = document.createElement('div');
  gravityIndicator.className = `status-indicator ${state.gravity ? 'status-gravity-on' : 'status-gravity-off'}`;
  gravityIndicator.textContent = `Gravity: ${state.gravity ? 'ON' : 'OFF'}`;
  statusIndicators.appendChild(gravityIndicator);

  // Spinning indicator
  if (state.spinning) {
    const spinningIndicator = document.createElement('div');
    spinningIndicator.className = 'status-indicator status-spinning';
    spinningIndicator.textContent = 'Spinning: ON';
    statusIndicators.appendChild(spinningIndicator);
  }

  // Raining indicator
  if (state.raining) {
    const rainingIndicator = document.createElement('div');
    rainingIndicator.className = 'status-indicator status-raining';
    rainingIndicator.textContent = 'Raining: ON';
    statusIndicators.appendChild(rainingIndicator);
  }
}

// Feedback System
function showFeedback(message) {
  feedbackText.textContent = message;
  feedbackDisplay.style.opacity = '1';
  
  setTimeout(() => {
    feedbackDisplay.style.opacity = '0';
  }, 3000);
}