// Add a specified delay in milliseconds
const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

// Write text to a target element with a specified delay in ms
function writeText(target, content, delay = 5) {
  return new Promise((resolve) => {
    const contentArray = content.split('');
    let current = 0;
    while (current < contentArray.length) {
      ((curr) => {
        setTimeout(() => {
          target.innerHTML += contentArray[curr];
          window.scrollTo(0, document.body.scrollHeight);
          if (curr === contentArray.length - 1) resolve();
        }, delay * curr);
      })(current++);
    }
  });
}

// Handle keypresses on the document, printing them to an 'input' span.
function handleKeypress(e, input, output) {
  function noInputHasFocus() {
    const elements = ['INPUT', 'TEXTAREA', 'BUTTON'];
    return elements.indexOf(document.activeElement.tagName) === -1;
  }
  if (noInputHasFocus()) {
    if (e.key === 'Enter') {
      const command = input.innerText;
      input.innerHTML = '';
      output.innerHTML += '<br><strong>' + command + '</strong>\n<br>';
      writeText(output, execute(command));
    } else if (e.key === 'Backspace') {
      input.innerHTML = input.innerHTML.substring(0, input.innerHTML.length - 1);
    } else if (e.key.length === 1) {
      input.insertAdjacentText('beforeend', e.key);
    }
  }
  function execute(command) {
    switch(command.toLowerCase()) {
        case '':
          return `\n`;
        case 'clear':
          const asciiText = document.getElementById('asciiText');
          if (asciiText) asciiText.style.display = 'none';
          output.innerHTML = '';
          return '';
        case 'resume':
          const modal = document.getElementById('resume-modal');
          const frame = document.getElementById('resume-frame');
          frame.src = 'resume.pdf';
          modal.style.display = 'block';
          return 'Opening resume...';
        case 'home':
          window.location.href = 'home.html';
          return 'Returning to homepage...';
        case 'head':
          window.location.href = 'characterhead.html';
          return 'Opening Mr. CharacterHead...';
        case 'game':
          window.location.href = 'https://calebluh.github.io/portfolio/';
          return 'Opening game...';
        case 'about':
          return `This is a retro terminal-style interface inspired 
  by old-school computers. You can enter commands like 
  "help", "clear", "resume", "home", and "head" to interact 
  with the site. Built with HTML, CSS, and JavaScript by 
  Caleb Luh using guides on the internet.`;
        case 'help':
          return `Enter a command here and something will be output.
  Valid options are:
   help - this help text
   clear - clear the screen
   head - open Mr. CharacterHead
   game - open my 2D portfolio game
   about - about this terminal
   resume - open my resume in popup window
   home - return to the homepage`;
        default: 
            return 'Unknown command';
    }
  }
}

function showCharacterHead() {
  const container = document.getElementById('characterhead-container');
  if (!container) return;
  container.style.display = 'block';
  container.innerHTML = ''; // Clear previous content

  // Dynamically load and run characterhead.js
  const script = document.createElement('script');
  script.src = 'characterhead.js';
  container.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
  // Terminal/Prompt initialization
  const asciiText = document.getElementById('asciiText');
  if (asciiText) {
    const asciiArt = asciiText.innerText;
    asciiText.innerHTML = '';
    const instructions = document.getElementById('instructions');
    const prompt = document.getElementById('prompt');
    const cursor = document.getElementById('cursor');
    const input = document.getElementById('command-input');
    const output = document.getElementById('output');
    (async () => {
      await wait(1000);
      await writeText(asciiText, asciiArt);
      await wait(500);
      await writeText(instructions, `Enter a command. Enter 'help' to see a list of commands.`);
      if (prompt) prompt.prepend('>');
      if (cursor) cursor.innerHTML = '_';
    })();
    document.addEventListener('keydown', (e) => handleKeypress(e, input, output));
  }
});