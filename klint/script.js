// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Terminal typing animation
const terminalCmd = document.getElementById('terminal-cmd');
const terminalOutput = document.getElementById('terminal-output');
const terminalCursor = document.getElementById('terminal-cursor');

const scenes = [
  {
    cmd: 'sudo ./klint',
    output: [
      '\x1b[blue][hidden_lkm]\x1b[/] \x1b[dim](kernel)\x1b[/]',
      '  \x1b[green]OK\x1b[/]',
      '',
      '\x1b[blue][hidden_processes]\x1b[/] \x1b[dim](process)\x1b[/]',
      '  \x1b[green]OK\x1b[/]',
      '',
      '\x1b[blue][syscall_table_integrity]\x1b[/] \x1b[dim](kernel)\x1b[/]',
      '  \x1b[green]OK\x1b[/]',
    ],
    pause: 3000
  },
  {
    cmd: 'sudo ./klint --json --scanner hidden_lkm',
    output: [
      '{',
      '  \x1b[cyan]"scanners"\x1b[/]: [{',
      '    \x1b[cyan]"scanner"\x1b[/]: \x1b[cyan]"hidden_lkm"\x1b[/],',
      '    \x1b[cyan]"status"\x1b[/]: \x1b[cyan]"clean"\x1b[/]',
      '  }],',
      '  \x1b[cyan]"summary"\x1b[/]: { \x1b[cyan]"total"\x1b[/]: \x1b[yellow]1\x1b[/], \x1b[cyan]"clean"\x1b[/]: \x1b[yellow]1\x1b[/] }',
      '}',
    ],
    pause: 3000
  },
  {
    cmd: 'sudo ./klint --list',
    output: [
      '\x1b[dim]SCANNER                      CATEGORIES                REQUIRES\x1b[/]',
      '\x1b[dim]--------------------------------------------------------------------\x1b[/]',
      'bpf_rootkit_detection        kernel, network, ...      tool:bpftool',
      'ftrace_redirection           kernel                    -',
      'hidden_lkm                   kernel                    -',
      'hidden_network_sockets       network                   tool:ss',
      'hidden_processes             process                   -',
      'kernel_entrypoint_integrity  kernel                    -',
      'syscall_table_integrity      kernel                    -',
      'unknown_kprobes              kernel                    -',
    ],
    pause: 3500
  }
];

const colorMap = {
  green: 'var(--accent-green)',
  blue: 'var(--accent-blue)',
  cyan: 'var(--accent-cyan)',
  yellow: 'var(--accent-yellow)',
  red: 'var(--accent-red)',
  dim: 'var(--text-dim)',
};

function renderColoredText(text) {
  return text.replace(/\x1b\[(\w+)\](.*?)\x1b\[\/\]/g, (_, color, content) => {
    const c = colorMap[color] || 'inherit';
    return `<span style="color:${c}">${content}</span>`;
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function typeText(el, text, speed) {
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await sleep(speed);
  }
}

async function runTerminal() {
  let sceneIndex = 0;

  while (true) {
    const scene = scenes[sceneIndex];

    // Clear
    terminalCmd.textContent = '';
    terminalOutput.innerHTML = '';
    terminalCursor.style.display = 'inline';

    // Type command
    await typeText(terminalCmd, scene.cmd, 45);

    // Hide cursor, show output
    terminalCursor.style.display = 'none';
    await sleep(400);

    // Reveal output lines
    for (const line of scene.output) {
      const div = document.createElement('div');
      div.innerHTML = renderColoredText(line);
      terminalOutput.appendChild(div);
      await sleep(80);
    }

    await sleep(scene.pause);
    sceneIndex = (sceneIndex + 1) % scenes.length;
  }
}

// Start animation when hero is visible
const heroTerminal = document.getElementById('hero-terminal');
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    observer.disconnect();
    runTerminal();
  }
}, { threshold: 0.3 });

observer.observe(heroTerminal);

// Navbar background on scroll
const nav = document.getElementById('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    nav.style.borderBottomColor = 'var(--border)';
  } else {
    nav.style.borderBottomColor = 'transparent';
  }
  lastScroll = scrollY;
}, { passive: true });
