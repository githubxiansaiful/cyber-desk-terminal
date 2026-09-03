// ============================================================================
// CYBERDECK // NEURAL TERMINAL CONTROLLER
// ============================================================================

(function () {
  'use strict';

  // DOM Elements
  const terminalArea = document.getElementById('terminalArea');
  const codeDisplay = document.getElementById('codeDisplay');
  const themeSelect = document.getElementById('themeSelect');
  const moduleSelect = document.getElementById('moduleSelect');
  const btnSound = document.getElementById('btnSound');
  const soundIcon = document.getElementById('soundIcon');
  const btnCrt = document.getElementById('btnCrt');
  const btnMatrix = document.getElementById('btnMatrix');
  const btnAutoHack = document.getElementById('btnAutoHack');
  const btnHelp = document.getElementById('btnHelp');
  const mobileTapPad = document.getElementById('mobileTapPad');

  // Window Controls
  const btnWinClose = document.getElementById('btnWinClose');
  const btnWinMin = document.getElementById('btnWinMin');
  const btnWinMax = document.getElementById('btnWinMax');
  const cyberSidebar = document.getElementById('cyberSidebar');

  // Modals
  const modalGranted = document.getElementById('modalGranted');
  const modalDenied = document.getElementById('modalDenied');
  const modalBreach = document.getElementById('modalBreach');
  const modalHelp = document.getElementById('modalHelp');

  const closeGranted = document.getElementById('closeGranted');
  const closeDenied = document.getElementById('closeDenied');
  const abortBreach = document.getElementById('abortBreach');
  const closeHelp = document.getElementById('closeHelp');

  // Footer Quick Badges
  const qbGranted = document.getElementById('qbGranted');
  const qbDenied = document.getElementById('qbDenied');
  const qbBreach = document.getElementById('qbBreach');
  const qbClear = document.getElementById('qbClear');

  // Telemetry elements
  const cpuLoadEl = document.getElementById('cpuLoad');
  const ramLoadEl = document.getElementById('ramLoad');
  const statPacketsEl = document.getElementById('statPackets');
  const hexDumpEl = document.getElementById('hexDump');
  const crackRoundEl = document.getElementById('crackRound');

  // State
  let currentModule = 'kernel';
  let snippetIndex = 0;
  let autoHackInterval = null;
  let isAutoHacking = false;
  let altPressCount = 0;
  let altTimer = null;
  let breachInterval = null;
  let packetCounter = 14289;

  // --------------------------------------------------------------------------
  // TYPING LOGIC
  // --------------------------------------------------------------------------
  function typeCodeChunk(charsCount) {
    const snippet = window.TERMINAL_SNIPPETS[currentModule] || window.TERMINAL_SNIPPETS.kernel;
    const chunkLength = charsCount || (Math.floor(Math.random() * 5) + 3);

    let nextChunk = snippet.substr(snippetIndex, chunkLength);
    snippetIndex += chunkLength;

    // Loop around when snippet ends
    if (snippetIndex >= snippet.length) {
      snippetIndex = 0;
      nextChunk += '\n\n/* [RE-SYNCHRONIZING CODE CYCLE...] */\n\n';
    }

    // Check if newline exists in chunk to play heavy enter clack
    if (nextChunk.includes('\n')) {
      window.soundEngine.playEnterKey();
    } else {
      window.soundEngine.playKeyClick();
    }

    codeDisplay.textContent += nextChunk;
    scrollToBottom();
  }

  function scrollToBottom() {
    terminalArea.scrollTop = terminalArea.scrollHeight;
  }

  function clearTerminal() {
    codeDisplay.textContent = '';
    snippetIndex = 0;
    scrollToBottom();
  }

  // --------------------------------------------------------------------------
  // AUTO HACK MODE
  // --------------------------------------------------------------------------
  function toggleAutoHack() {
    isAutoHacking = !isAutoHacking;
    if (isAutoHacking) {
      btnAutoHack.classList.add('active');
      btnAutoHack.innerHTML = '■ STOP AUTO';
      autoHackInterval = setInterval(() => {
        typeCodeChunk(Math.floor(Math.random() * 4) + 3);
      }, 45);
    } else {
      btnAutoHack.classList.remove('active');
      btnAutoHack.innerHTML = '▶ AUTO HACK';
      clearInterval(autoHackInterval);
      autoHackInterval = null;
    }
  }

  // --------------------------------------------------------------------------
  // MODALS & SPECIAL ALERTS
  // --------------------------------------------------------------------------
  function showModal(modalEl) {
    closeAllModals();
    modalEl.classList.add('show');
  }

  function closeAllModals() {
    [modalGranted, modalDenied, modalBreach, modalHelp].forEach((m) => {
      m.classList.remove('show');
    });
    if (breachInterval) {
      clearInterval(breachInterval);
      breachInterval = null;
    }
  }

  function triggerAccessGranted() {
    showModal(modalGranted);
    window.soundEngine.playAccessGranted();
  }

  function triggerAccessDenied() {
    showModal(modalDenied);
    window.soundEngine.playAccessDenied();
  }

  function triggerDataBreach() {
    showModal(modalBreach);
    window.soundEngine.playAlarmBeep();

    const breachProgress = document.getElementById('breachProgress');
    const breachPercent = document.getElementById('breachPercent');
    const breachSize = document.getElementById('breachSize');
    const breachRate = document.getElementById('breachRate');

    let percent = 0;
    const totalMB = 4200;
    breachProgress.style.width = '0%';
    breachPercent.textContent = '0%';
    breachSize.textContent = '0 MB';

    breachInterval = setInterval(() => {
      percent += Math.random() * 3.5 + 1.2;
      if (percent >= 100) {
        percent = 100;
        clearInterval(breachInterval);
        breachInterval = null;
        window.soundEngine.playAccessGranted();
      }

      breachProgress.style.width = percent.toFixed(1) + '%';
      breachPercent.textContent = Math.floor(percent) + '%';
      breachSize.textContent = Math.floor((percent / 100) * totalMB) + ' MB';
      breachRate.textContent = (Math.random() * 200 + 520).toFixed(0) + ' MB/s';
    }, 120);
  }

  // --------------------------------------------------------------------------
  // KEYBOARD EVENT LISTENER
  // --------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    // If modal is active, ESC closes it
    if (e.key === 'Escape') {
      closeAllModals();
      return;
    }

    // If any modal is showing, ignore typing shortcuts
    const isAnyModalOpen = [modalGranted, modalDenied, modalBreach, modalHelp].some((m) =>
      m.classList.contains('show')
    );
    if (isAnyModalOpen) return;

    // Alt x 3 detection (Access Granted)
    if (e.key === 'Alt') {
      e.preventDefault();
      altPressCount++;
      clearTimeout(altTimer);
      altTimer = setTimeout(() => {
        altPressCount = 0;
      }, 500);

      if (altPressCount >= 3) {
        altPressCount = 0;
        triggerAccessGranted();
      }
      return;
    }

    // CapsLock (Access Denied)
    if (e.key === 'CapsLock') {
      triggerAccessDenied();
      return;
    }

    // Single key triggers (case-insensitive)
    const key = e.key.toLowerCase();

    // Hotkey: B -> Breach
    if (key === 'b' && !e.ctrlKey && !e.metaKey && e.altKey === false) {
      if (e.shiftKey) {
        triggerDataBreach();
        return;
      }
    }

    // Hotkey: M -> Matrix Rain Toggle
    if (key === 'm' && e.altKey) {
      toggleMatrixRain();
      return;
    }

    // Hotkey: A -> Auto Hack Toggle
    if (key === 'a' && e.altKey) {
      toggleAutoHack();
      return;
    }

    // Hotkey: H -> Help
    if (key === 'h' && e.altKey) {
      showModal(modalHelp);
      return;
    }

    // Hotkey: S -> Sound Toggle
    if (key === 's' && e.altKey) {
      toggleSound();
      return;
    }

    // Ignore function keys (except F11 for fullscreen standard) and control combos
    if (
      e.key === 'Control' ||
      e.key === 'Shift' ||
      e.key === 'Meta' ||
      e.key === 'Tab' ||
      e.key === 'F11' ||
      e.key === 'F12' ||
      e.key === 'F5'
    ) {
      return;
    }

    // Prevent default scrolling for Space or Page keys
    if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.code)) {
      e.preventDefault();
    }

    // Stream realistic code chunk
    typeCodeChunk();
  });

  // Mobile / Click to hack
  terminalArea.addEventListener('click', () => {
    typeCodeChunk(6);
  });

  if (mobileTapPad) {
    mobileTapPad.addEventListener('click', (e) => {
      e.stopPropagation();
      typeCodeChunk(10);
    });
  }

  // --------------------------------------------------------------------------
  // TOOLBAR CONTROLS & EVENT BINDINGS
  // --------------------------------------------------------------------------
  // Theme Selector
  themeSelect.addEventListener('change', (e) => {
    document.body.className = `${e.target.value} ${btnCrt.classList.contains('active') ? 'crt-active' : ''} ${btnMatrix.classList.contains('active') ? 'rain-active' : ''}`;
  });

  // Module Selector
  moduleSelect.addEventListener('change', (e) => {
    currentModule = e.target.value;
    snippetIndex = 0;
    codeDisplay.textContent += `\n\n/* >>> ATTACHING MODULE: ${currentModule.toUpperCase()} <<< */\n\n`;
    scrollToBottom();
  });

  // Sound Toggle
  function toggleSound() {
    const isAudioOn = window.soundEngine.toggle();
    if (isAudioOn) {
      soundIcon.textContent = '🔊';
      btnSound.classList.remove('active');
    } else {
      soundIcon.textContent = '🔇';
      btnSound.classList.add('active');
    }
  }
  btnSound.addEventListener('click', toggleSound);

  // CRT Toggle
  btnCrt.addEventListener('click', () => {
    document.body.classList.toggle('crt-active');
    btnCrt.classList.toggle('active');
  });

  // Matrix Rain Toggle
  function toggleMatrixRain() {
    document.body.classList.toggle('rain-active');
    btnMatrix.classList.toggle('active');
  }
  btnMatrix.addEventListener('click', toggleMatrixRain);

  // Auto Hack Button
  btnAutoHack.addEventListener('click', toggleAutoHack);

  // Help Button
  btnHelp.addEventListener('click', () => showModal(modalHelp));

  // Window Controls
  btnWinClose.addEventListener('click', () => {
    if (confirm('Initiate Emergency Wipe of Cyberdeck Shell?')) {
      clearTerminal();
    }
  });

  btnWinMin.addEventListener('click', () => {
    cyberSidebar.classList.toggle('collapsed');
  });

  btnWinMax.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Modal Dismissals
  closeGranted.addEventListener('click', closeAllModals);
  closeDenied.addEventListener('click', closeAllModals);
  abortBreach.addEventListener('click', closeAllModals);
  closeHelp.addEventListener('click', closeAllModals);

  // Quick Badges
  qbGranted.addEventListener('click', triggerAccessGranted);
  qbDenied.addEventListener('click', triggerAccessDenied);
  qbBreach.addEventListener('click', triggerDataBreach);
  qbClear.addEventListener('click', clearTerminal);

  // --------------------------------------------------------------------------
  // MATRIX DIGITAL RAIN CANVAS
  // --------------------------------------------------------------------------
  const matrixCanvas = document.getElementById('matrixCanvas');
  const ctx = matrixCanvas.getContext('2d');

  let matrixWidth = (matrixCanvas.width = window.innerWidth);
  let matrixHeight = (matrixCanvas.height = window.innerHeight);

  const katakana = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
  const fontSize = 14;
  let columns = Math.floor(matrixWidth / fontSize);
  let drops = [];

  function initMatrixDrops() {
    columns = Math.floor(matrixWidth / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }
  }
  initMatrixDrops();

  window.addEventListener('resize', () => {
    matrixWidth = matrixCanvas.width = window.innerWidth;
    matrixHeight = matrixCanvas.height = window.innerHeight;
    initMatrixDrops();
  });

  function drawMatrixRain() {
    ctx.fillStyle = 'rgba(6, 14, 9, 0.08)';
    ctx.fillRect(0, 0, matrixWidth, matrixHeight);

    // Get active theme color for rain
    const style = getComputedStyle(document.body);
    const rainColor = style.getPropertyValue('--border-color').trim() || '#00ff66';

    ctx.fillStyle = rainColor;
    ctx.font = `${fontSize}px 'Fira Code', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = katakana.charAt(Math.floor(Math.random() * katakana.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(char, x, y);

      if (y > matrixHeight && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    requestAnimationFrame(drawMatrixRain);
  }
  requestAnimationFrame(drawMatrixRain);

  // --------------------------------------------------------------------------
  // SATELLITE RADAR WIDGET
  // --------------------------------------------------------------------------
  const radarCanvas = document.getElementById('radarCanvas');
  const radarCtx = radarCanvas.getContext('2d');
  const radarRadius = radarCanvas.width / 2;
  let radarAngle = 0;

  const blips = [
    { distance: 0.35, angle: 0.8, alpha: 0 },
    { distance: 0.65, angle: 2.2, alpha: 0 },
    { distance: 0.82, angle: 4.5, alpha: 0 }
  ];

  function drawRadar() {
    radarCtx.clearRect(0, 0, radarCanvas.width, radarCanvas.height);

    const style = getComputedStyle(document.body);
    const primaryColor = style.getPropertyValue('--border-color').trim() || '#00ff66';

    // Circles
    radarCtx.strokeStyle = 'rgba(0, 255, 102, 0.2)';
    radarCtx.lineWidth = 1;
    [0.25, 0.5, 0.75, 0.98].forEach((scale) => {
      radarCtx.beginPath();
      radarCtx.arc(radarRadius, radarRadius, radarRadius * scale, 0, Math.PI * 2);
      radarCtx.stroke();
    });

    // Crosshairs
    radarCtx.beginPath();
    radarCtx.moveTo(0, radarRadius);
    radarCtx.lineTo(radarCanvas.width, radarRadius);
    radarCtx.moveTo(radarRadius, 0);
    radarCtx.lineTo(radarRadius, radarCanvas.height);
    radarCtx.stroke();

    // Rotating Sweep line
    radarAngle += 0.035;
    if (radarAngle >= Math.PI * 2) radarAngle = 0;

    radarCtx.save();
    radarCtx.translate(radarRadius, radarRadius);
    radarCtx.rotate(radarAngle);

    const sweepGradient = radarCtx.createLinearGradient(0, 0, radarRadius, 0);
    sweepGradient.addColorStop(0, 'rgba(0, 255, 102, 0.05)');
    sweepGradient.addColorStop(1, primaryColor);

    radarCtx.strokeStyle = sweepGradient;
    radarCtx.lineWidth = 2;
    radarCtx.beginPath();
    radarCtx.moveTo(0, 0);
    radarCtx.lineTo(radarRadius, 0);
    radarCtx.stroke();
    radarCtx.restore();

    // Update and draw radar blips
    blips.forEach((blip) => {
      // Check if sweep line passed blip angle
      const diff = Math.abs(radarAngle - blip.angle);
      if (diff < 0.05) {
        blip.alpha = 1;
      }
      if (blip.alpha > 0.01) {
        blip.alpha -= 0.012;
      }

      const bx = radarRadius + Math.cos(blip.angle) * (radarRadius * blip.distance);
      const by = radarRadius + Math.sin(blip.angle) * (radarRadius * blip.distance);

      radarCtx.fillStyle = `rgba(255, 255, 255, ${blip.alpha})`;
      radarCtx.beginPath();
      radarCtx.arc(bx, by, 3.5, 0, Math.PI * 2);
      radarCtx.fill();
    });

    requestAnimationFrame(drawRadar);
  }
  requestAnimationFrame(drawRadar);

  // --------------------------------------------------------------------------
  // HEX MEMORY STREAM & TELEMETRY JITTER
  // --------------------------------------------------------------------------
  function generateHexLine(addrOffset) {
    const addr = '0x' + (0x7fff0000 + addrOffset).toString(16).toUpperCase();
    let bytes = '';
    let ascii = '';
    for (let i = 0; i < 8; i++) {
      const b = Math.floor(Math.random() * 256);
      bytes += b.toString(16).padStart(2, '0').toUpperCase() + ' ';
      ascii += b > 32 && b < 127 ? String.fromCharCode(b) : '.';
    }
    return `<div class="hex-row"><span class="hex-addr">${addr}</span> <span class="hex-bytes">${bytes}</span> <span class="hex-ascii">${ascii}</span></div>`;
  }

  function updateHexDump() {
    let html = '';
    for (let i = 0; i < 6; i++) {
      html += generateHexLine(i * 16);
    }
    hexDumpEl.innerHTML = html;
  }
  updateHexDump();
  setInterval(updateHexDump, 1400);

  // Telemetry real-time updates
  setInterval(() => {
    // CPU jitter
    const cpu = Math.floor(Math.random() * 45 + 30);
    cpuLoadEl.textContent = cpu + '%';

    // RAM jitter
    const ram = (62 + Math.random() * 3).toFixed(1);
    ramLoadEl.textContent = ram + '%';

    // Packet counter
    packetCounter += Math.floor(Math.random() * 60 + 15);
    statPacketsEl.textContent = packetCounter.toLocaleString();

    // Cracking round
    if (crackRoundEl) {
      crackRoundEl.textContent = (18000 + Math.floor(Math.random() * 1500)).toLocaleString();
    }
  }, 1000);

  // Focus terminal area on load
  terminalArea.focus();
})();
