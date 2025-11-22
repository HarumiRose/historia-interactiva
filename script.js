//este es el script.js
// ========== VARIABLES GLOBALES ==========
let currentCharacter = null;
let charactersData = {};
let storyScenes = [];
let currentScene = 0;
let currentParagraph = 0;

// ========== CARGAR DATOS DEL CMS ==========

async function loadCharacterData(characterId) {
  try {
    const response = await fetch(`/content/characters/${characterId}.json`);
    const data = await response.json();
    charactersData[characterId] = data;
    return data;
  } catch (error) {
    console.error(`Error cargando datos de ${characterId}:`, error);
    return null;
  }
}

async function loadStoryScenes() {
  try {
    // En producción, esto cargaría todas las escenas desde /content/scenes/
    // Por ahora usamos un placeholder
    storyScenes = [
      {
        chapter: 1,
        order: 1,
        paragraphs: [
          {
            content: "Esta es una escena de ejemplo. Reemplázala desde el panel admin.",
            style: "normal",
            showButton: true,
            buttonText: "Continuar"
          }
        ]
      }
    ];
  } catch (error) {
    console.error("Error cargando escenas:", error);
  }
}

// ========== INICIALIZACIÓN ==========

async function init() {
  // Cargar datos de ambos personajes
  await loadCharacterData('izuku');
  await loadCharacterData('harumi');
  
  // Crear opciones del selector dinámicamente
  await createCharacterSelector();
  
  await loadStoryScenes();
  updatePhoneTime();
  setInterval(updatePhoneTime, 60000);
}

async function createCharacterSelector() {
  const panel = document.getElementById('character-selector-panel');
  let html = '';
  
  // Iterar sobre los personajes cargados
  for (const charId in charactersData) {
    const char = charactersData[charId];
    
    const avatarHtml = char.avatar && char.avatar.startsWith('/images/') 
      ? `<img src="${char.avatar}" alt="${char.name}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">`
      : `<div class="char-avatar" style="background: ${char.color};">${char.name[0]}</div>`;
    
    html += `
      <div class="character-option" onclick="selectCharacter('${charId}')">
        ${avatarHtml}
        <div class="char-info">
          <strong>${char.name}</strong>
        </div>
      </div>
    `;
  }
  
  panel.innerHTML = html;
}

// ========== FUNCIONES DE PERSONAJES ==========

function toggleCharacterSelector() {
  const panel = document.getElementById('character-selector-panel');
  panel.classList.toggle('show');
}

async function selectCharacter(charId) {
  currentCharacter = charId;
  
  // Cargar datos si no están en memoria
  if (!charactersData[charId]) {
    await loadCharacterData(charId);
  }
  
  const char = charactersData[charId];
  if (!char) return;
  
  // Mostrar sidebar
  document.getElementById('sidebar').classList.add('show');
  document.getElementById('sidebar-toggle').classList.add('show');
  
  // Actualizar icono del botón
  document.getElementById('current-character-icon').textContent = char.icon;
  
  // Actualizar perfil
  const profileAvatar = document.querySelector('.profile-avatar');
  if (char.avatar && char.avatar.startsWith('/images/')) {
    profileAvatar.innerHTML = `<img src="${char.avatar}" alt="${char.name}">`;
  } else {
    profileAvatar.textContent = char.name[0];
  }
  profileAvatar.style.background = char.color;
  document.querySelector('.profile-name').textContent = char.name;
  
  // Actualizar estados
  document.getElementById('mood-state').textContent = char.mood;
  document.getElementById('energy-state').textContent = char.energy;
  
  // Actualizar fondo del teléfono
  if (char.phoneBg) {
    const phoneScreen = document.getElementById('phone-lockscreen');
    phoneScreen.classList.add('custom-bg');
    phoneScreen.style.backgroundImage = `url('${char.phoneBg}')`;
  }
  
  // Actualizar todo el contenido
  updateInventory(char.inventory);
  updateContacts(char.contacts);
  updateDiary(char.diary);
  updatePhoneMap(char.currentLocation, char.locationHistory, char.savedLocations);
  updatePhoneWallet(char.wallet);
  updatePhoneNotes(char.notes);
  updatePhoneSearches(char.searches);
  updateTimeline(char.timeline);
  
  // Marcar como seleccionado
  document.querySelectorAll('.character-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  event.target.closest('.character-option').classList.add('selected');
  
  // Cerrar panel
  document.getElementById('character-selector-panel').classList.remove('show');
  
  console.log(`Personaje cambiado a: ${char.name}`);
}

// ========== FUNCIONES DE HISTORIA ==========

function loadScene(sceneIndex) {
  if (!storyScenes[sceneIndex]) return;
  
  currentScene = sceneIndex;
  currentParagraph = 0;
  
  const scene = storyScenes[sceneIndex];
  const content = document.getElementById('story-content');
  content.innerHTML = '';
  
  // Mostrar primer párrafo
  showNextParagraph();
}

function showNextParagraph() {
  const scene = storyScenes[currentScene];
  if (!scene || currentParagraph >= scene.paragraphs.length) return;
  
  const paragraph = scene.paragraphs[currentParagraph];
  const content = document.getElementById('story-content');
  
  // Crear div del párrafo
  const pDiv = document.createElement('div');
  pDiv.className = `story-paragraph ${paragraph.style}`;
  pDiv.innerHTML = paragraph.content;
  
  content.appendChild(pDiv);
  
  // Crear botón si es necesario
  if (paragraph.showButton) {
    const btn = document.createElement('button');
    btn.className = 'continue-button';
    btn.textContent = paragraph.buttonText || 'Continuar';
    btn.onclick = () => {
      // Aplicar actualizaciones
      if (paragraph.updates) {
        applyUpdates(paragraph.updates);
      }
      
      // Mostrar siguiente párrafo
      currentParagraph++;
      btn.remove();
      showNextParagraph();
    };
    content.appendChild(btn);
  } else {
    // Si no hay botón, avanzar automáticamente
    currentParagraph++;
  }
  
  // Scroll suave al final
  content.scrollTop = content.scrollHeight;
}

function applyUpdates(updates) {
  if (!updates) return;
  
  // Usar el personaje especificado en updates, o el actual por defecto
  const targetCharId = updates.character || currentCharacter;
  if (!targetCharId) return;
  
  const char = charactersData[targetCharId];
  
  // Actualizar estado y energía
  if (updates.mood) {
    char.mood = updates.mood;
    document.getElementById('mood-state').textContent = updates.mood;
  }
  
  if (updates.energy) {
    char.energy = updates.energy;
    document.getElementById('energy-state').textContent = updates.energy;
  }
  
  // Actualizar mensajes
  if (updates.phoneMessages) {
    updates.phoneMessages.forEach(msg => {
      // Buscar contacto y agregar mensaje
      const contact = char.contacts.find(c => c.id === msg.contact);
      if (contact) {
        contact.messages.push({
          sender: 'contact',
          text: msg.message,
          time: msg.time
        });
        contact.lastMessage = msg.message;
        contact.time = msg.time;
      }
    });
    updateContacts(char.contacts);
  }
  
  // Actualizar diario
  if (updates.diaryEntry) {
    char.diary.unshift(updates.diaryEntry);
    updateDiary(char.diary);
  }
  
  // Actualizar notas
  if (updates.notes) {
    char.notes.push(...updates.notes);
    updatePhoneNotes(char.notes);
  }
  
  // Actualizar búsquedas
  if (updates.searches) {
    char.searches.unshift(...updates.searches);
    updatePhoneSearches(char.searches);
  }
  
  // Actualizar timeline
  if (updates.timeline) {
    char.timeline.forEach(t => t.current = false);
    char.timeline.unshift(...updates.timeline);
    updateTimeline(char.timeline);
  }
  
  // Actualizar ubicación
  if (updates.location) {
    char.locationHistory.unshift({
      name: char.currentLocation.name,
      detail: char.currentLocation.detail,
      icon: char.currentLocation.icon
    });
    char.currentLocation = updates.location;
    updatePhoneMap(char.currentLocation, char.locationHistory, char.savedLocations);
  }
  
  // Actualizar transacción
  if (updates.transaction) {
    char.wallet.expenses.unshift(updates.transaction);
    
    // Actualizar efectivo
    const amount = parseInt(updates.transaction.amount.replace(/[^0-9-]/g, ''));
    const currentCash = parseInt(char.wallet.cash.replace(/[^0-9]/g, ''));
    char.wallet.cash = `¥${currentCash + amount}`;
    
    updatePhoneWallet(char.wallet);
  }
}

// ========== FUNCIONES DE ACTUALIZACIÓN DE UI ==========

function updateInventory(items) {
  const panel = document.getElementById('inventario');
  let html = '<h3>🎒 Inventario</h3>';
  
  items.forEach(item => {
    html += `
      <div class="panel-item">
        <div class="inventory-item">
          <img src="${item.icon}" alt="${item.name}">
          <div style="flex: 1;">
            <strong>${item.name}</strong><br>
            <small>${item.description}</small>
          </div>
        </div>
      </div>
    `;
  });
  
  panel.innerHTML = html;
}

function updateContacts(contacts) {
  const contactList = document.querySelector('#mensajes-tab #contact-list');
  let html = '';
  
  contacts.forEach(contact => {
    const avatarHtml = contact.avatar.startsWith('/images/') 
      ? `<img src="${contact.avatar}" alt="${contact.name}">`
      : contact.avatar;
    
    html += `
      <div class="panel-item contact-item" onclick="openChat('${contact.id}')">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="contact-avatar">${avatarHtml}</div>
          <div style="flex: 1;">
            <strong>${contact.name}</strong><br>
            <small style="color: #999;">${contact.lastMessage}</small>
          </div>
          <span style="color: #999; font-size: 11px;">${contact.time}</span>
        </div>
      </div>
    `;
  });
  
  contactList.innerHTML = html;
}

function updateDiary(entries) {
  const panel = document.getElementById('diario');
  const charName = currentCharacter ? charactersData[currentCharacter].name : 'Usuario';
  let html = `<h3>📔 Diario de ${charName}</h3>`;
  
  entries.forEach(entry => {
    html += `
      <div class="diary-entry">
        <div class="diary-date">${entry.date}</div>
        <div class="diary-content">${entry.content}</div>
      </div>
    `;
  });
  
  panel.innerHTML = html;
}

function updatePhoneMap(current, history, saved) {
  const tab = document.getElementById('mapa-tab');
  
  let html = `
    <div class="map-container">
      <div class="location-marker">📍 ${current.name}</div>
    </div>
    <div style="margin-top: 15px;">
      <h4 class="section-title">📍 Ubicación actual</h4>
      <div class="location-current">
        <strong>${current.name}</strong><br>
        <small>${current.detail}</small>
      </div>
      
      <h4 class="section-title">🕐 Historial de ubicaciones</h4>
      <div class="location-history">
  `;
  
  history.forEach(loc => {
    html += `
      <div class="location-item">
        <span>${loc.icon}</span>
        <div style="flex: 1;">
          <strong>${loc.name}</strong><br>
          <small>${loc.detail}</small>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  if (saved && saved.length > 0) {
    html += '<h4 class="section-title">⭐ Ubicaciones guardadas</h4><div class="location-history">';
    saved.forEach(loc => {
      html += `
        <div class="location-item">
          <span>${loc.icon}</span>
          <div style="flex: 1;">
            <strong>${loc.name}</strong><br>
            <small>${loc.address}</small>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }
  
  html += '</div>';
  tab.innerHTML = html;
}

function updatePhoneWallet(wallet) {
  const tab = document.getElementById('cartera-tab');
  
  let html = `
    <div class="wallet-item">
      <span>💴 Efectivo</span>
      <span class="wallet-amount">${wallet.cash}</span>
    </div>
    <div class="wallet-item">
      <span>🚇 Suica</span>
      <span style="color: #4caf50; font-size: 14px;">${wallet.suica}</span>
    </div>
  `;
  
  if (wallet.tpoint) {
    html += `
      <div class="wallet-item">
        <span>🔵 T-Point</span>
        <span style="color: #2196f3; font-size: 14px;">${wallet.tpoint}</span>
      </div>
    `;
  }
  
  if (wallet.ponta) {
    html += `
      <div class="wallet-item">
        <span>🟠 Ponta</span>
        <span style="color: #ff9800; font-size: 14px;">${wallet.ponta}</span>
      </div>
    `;
  }
  
  if (wallet.cards) {
    wallet.cards.forEach(card => {
      html += `
        <div class="custom-card ${card.color ? 'has-color' : ''}" ${card.color ? `style="border-left-color: ${card.color}"` : ''}>
          <span>${card.name}</span>
          <span style="font-size: 14px;">${card.balance}</span>
        </div>
      `;
    });
  }
  
  html += `
    <div class="expense-history">
      <h4>📊 Historial de gastos</h4>
  `;
  
  wallet.expenses.forEach(expense => {
    html += `
      <div class="expense-item">
        <span>${expense.name}</span>
        <span class="expense-${expense.type}">${expense.amount}</span>
      </div>
    `;
  });
  
  html += '</div>';
  tab.innerHTML = html;
}

function updatePhoneNotes(notes) {
  const content = `
    <div style="padding: 10px;">
      <h4 style="color: #ff9800; margin-top: 0;">Mis Notas</h4>
      ${notes.map(note => `
        <div style="background: #fff9e6; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 3px solid #ff9800;">
          <strong>${note.title}</strong><br>
          <small style="color: #666;">${note.content}</small>
        </div>
      `).join('')}
    </div>
  `;
  
  window.currentNotesContent = content;
}

function updatePhoneSearches(searches) {
  const tab = document.getElementById('busqueda-tab');
  
  let html = '<h4 style="margin: 0 0 12px 0; color: #4caf50; font-size: 13px;">🔍 Historial de búsqueda</h4>';
  html += '<div style="font-size: 13px; color: #666;">';
  
  searches.forEach((search, index) => {
    html += `
      <div style="padding: 10px; background: #f5f5f5; border-radius: 6px; margin-bottom: 6px; ${index === 0 ? 'border-left: 3px solid #4caf50;' : ''}">
        <div style="font-weight: 500; color: #333;">${search.query}</div>
        <small style="color: #999;">${search.time}</small>
      </div>
    `;
  });
  
  html += '</div>';
  tab.innerHTML = html;
}

function updateTimeline(timeline) {
  const panel = document.getElementById('timeline');
  
  let html = '<h3>⏰ Línea de Tiempo</h3><div class="timeline-container">';
  
  timeline.forEach(item => {
    const [event, detail] = item.event.split('|');
    html += `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-time">${item.time}</div>
          <div class="timeline-event ${item.current ? 'current' : ''}">
            <strong>${event}</strong>
            ${detail ? `<br><small>${detail}</small>` : ''}
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  panel.innerHTML = html;
}

// ========== FUNCIONES DE TELÉFONO ==========

function updatePhoneTime() {
  const now = new Date();
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  
  const timeLarge = document.querySelector('.phone-time-large');
  const dateLarge = document.querySelector('.phone-date-large');
  
  if (timeLarge) timeLarge.textContent = `${hours}:${minutes}`;
  if (dateLarge) dateLarge.textContent = `${day}, ${date} de ${month}`;
}

function openChat(contactId) {
  if (!currentCharacter) return;
  
  const char = charactersData[currentCharacter];
  const contact = char.contacts.find(c => c.id === contactId);
  if (!contact) return;
  
  document.getElementById('contact-list').style.display = 'none';
  document.getElementById('chat-view').style.display = 'block';
  
  const avatarHtml = contact.avatar.startsWith('/images/') 
    ? `<img src="${contact.avatar}" alt="${contact.name}">`
    : contact.avatar;
  
  document.getElementById('chat-name').textContent = contact.name;
  document.getElementById('chat-avatar').innerHTML = avatarHtml;
  
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  
  contact.messages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
      margin: 10px 0;
      padding: 10px 12px;
      border-radius: 12px;
      max-width: 80%;
      ${msg.sender === 'me' 
        ? 'background: linear-gradient(135deg, #ff5fa2, #ff8dc7); color: white; margin-left: auto; text-align: right;' 
        : 'background: #f0f0f0; color: #333;'}
    `;
    msgDiv.innerHTML = `
      <div style="font-size: 14px;">${msg.text}</div>
      <div style="font-size: 10px; margin-top: 4px; opacity: 0.7;">${msg.time}</div>
    `;
    chatMessages.appendChild(msgDiv);
  });
  
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function closeChat() {
  document.getElementById('contact-list').style.display = 'block';
  document.getElementById('chat-view').style.display = 'none';
}

function openPhoneApp(appName) {
  document.getElementById('phone-lockscreen').style.display = 'none';
  document.getElementById('phone-app-view').style.display = 'flex';
  
  const content = document.getElementById('phone-app-content');
  const title = document.getElementById('phone-app-title');
  
  const tabs = {
    'mensajes': { title: '💬 Mensajes', tab: 'mensajes-tab' },
    'llamadas': { title: '📞 Llamadas', tab: 'llamadas-tab' },
    'mapa': { title: '🗺️ Mapa', tab: 'mapa-tab' },
    'cartera': { title: '💳 Cartera', tab: 'cartera-tab' },
    'notas': { title: '📝 Notas', content: window.currentNotesContent },
    'busqueda': { title: '🔍 Búsqueda', tab: 'busqueda-tab' }
  };
  
  const app = tabs[appName];
  if (app) {
    title.textContent = app.title;
    content.innerHTML = app.content || document.getElementById(app.tab).innerHTML;
  }
}

function closePhoneApp() {
  document.getElementById('phone-lockscreen').style.display = 'flex';
  document.getElementById('phone-app-view').style.display = 'none';
}

// ========== FUNCIONES DE PANELES ==========

function openPanel(id) {
  const allPanels = document.querySelectorAll('.panel');
  const targetPanel = document.getElementById(id);
  const allButtons = document.querySelectorAll('#sidebar button');
  const isOpen = targetPanel.classList.contains('show');
  
  allPanels.forEach(p => {
    if (p.classList.contains('show')) {
      p.classList.add('closing');
      setTimeout(() => {
        p.classList.remove('show', 'closing');
        p.style.display = 'none';
      }, 300);
    }
  });
  
  allButtons.forEach(b => b.classList.remove('active'));
  
  if (!isOpen) {
    setTimeout(() => {
      targetPanel.style.display = 'block';
      targetPanel.classList.add('show');
      event.target.closest('button').classList.add('active');
    }, 300);
  }
}

function toggleSidebar() {
  document.body.classList.toggle('sidebar-hidden');
}

// ========== EVENT LISTENERS ==========

document.addEventListener('click', (e) => {
  const panel = document.getElementById('character-selector-panel');
  const btn = document.getElementById('character-selector-btn');
  
  if (!panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('show');
  }
});

// ========== INICIALIZAR AL CARGAR ==========
init();

