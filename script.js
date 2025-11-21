
// Datos de la historia
const story = {
  currentChapter: 0,
  chaptersCompleted: [0],
  chapters: [
    {
      title: "El Encuentro",
      content: `
        <h1>Capítulo 1: El Encuentro</h1>
        <p>Aquí va tu historia...</p>
      `
    },
    {
      title: "Una Conversación Inesperada",
      content: `
        <h1>Capítulo 2: Una Conversación Inesperada</h1>
        <p>Continuación de tu historia...</p>
      `
    }
  ]
};

// Datos de chat POR PERSONAJE (DIFERENTE PARA CADA UNO)
const chatDataByCharacter = {
  izuku: {
    umi: {
      name: 'Umi-chan 💕',
      avatar: '💗',
      color: 'linear-gradient(135deg, #ff5fa2, #ff8dc7)',
      messages: [
        { sender: 'umi', text: 'Buenos días Izu-kun! 💚', time: '7:30' },
        { sender: 'me', text: 'Buenos días Umi-chan! 💕', time: '7:32' },
        { sender: 'umi', text: 'Cómo dormiste? Soñaste conmigo? 😊', time: '7:33' },
        { sender: 'me', text: 'Jaja siempre 😳💚', time: '7:35' },
        { sender: 'umi', text: 'Aww eres tan lindo 💗', time: '7:36' }
      ]
    },
    mama: {
      name: 'Mamá',
      avatar: 'M',
      color: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
      messages: [
        { sender: 'mama', text: 'Hola cariño!', time: 'Ayer 18:20' },
        { sender: 'me', text: 'Sí ma, te llamo mañana!', time: 'Ayer 19:45' }
      ]
    }
  },
  harumi: {
    aiko: {
      name: 'Baku💣',
      avatar: '💥',
      color: 'linear-gradient(135deg, #ff5fa2, #ff8dc7)',
      messages: [
        { sender: 'me', text: 'Me dejaste corriendo sola como tonta', time: '8:14' },
        { sender: 'aiko', text: 'Yo acabé primero. ¿Qué querías? ¿Que te hiciera barra?', time: '8:15' },
        { sender: 'me', text: 'No, talvez un buena suerte? o, no te mueras?', time: '8:17' },
        { sender: 'aiko', text: 'OK', time: '8:18' },
        { sender: 'aiko', text: 'MUERETE', time: '8:18' },
      ]
    },
    papa: {
      name: 'Papá',
      avatar: 'P',
      color: 'linear-gradient(135deg, #2196f3, #64b5f6)',
      messages: [
        { sender: 'papa', text: 'Hija, cómo va todo?', time: 'Ayer 19:00' },
        { sender: 'me', text: 'Todo bien papá! Te extraño', time: 'Ayer 19:30' }
      ]
    }
  }
};
// ========== FUNCIONES SIMPLES DE ESTADO ==========

function changeAffinity(emoji, text) {
  document.getElementById('affinity-emoji').textContent = emoji;
  document.getElementById('affinity-stage').textContent = text;
}

function changeMood(text) {
  document.getElementById('mood-state').textContent = text;
}

function changeEnergy(text) {
  document.getElementById('energy-state').textContent = text;
}


// ========== FUNCIONES DE CAPÍTULOS ==========

function loadChapter(index) {
  if (index < 0 || index >= story.chapters.length) return;
  
  story.currentChapter = index;
  const chapter = story.chapters[index];
  
  document.getElementById('cap-info').textContent = `Capítulo ${index + 1} — ${chapter.title}`;
  
  let html = chapter.content;
  
  const isCompleted = story.chaptersCompleted.includes(index);
  if (!isCompleted) {
    html += `<button id="finish-chapter-btn" onclick="finishChapter()">✓ Terminar capítulo</button>`;
  }
  
  document.getElementById('story-content').innerHTML = html;
  document.getElementById('content').scrollTop = 0;
  
  document.getElementById('prev-btn').disabled = index === 0;
  document.getElementById('next-btn').style.display = isCompleted && index < story.chapters.length - 1 ? 'inline-block' : 'none';
  
  updateChapterList();
}

function finishChapter() {
  if (!story.chaptersCompleted.includes(story.currentChapter)) {
    story.chaptersCompleted.push(story.currentChapter);
    updateAffinity(5);
    loadChapter(story.currentChapter);
  }
}

function previousChapter() {
  loadChapter(story.currentChapter - 1);
}

function nextChapter() {
  if (story.chaptersCompleted.includes(story.currentChapter)) {
    loadChapter(story.currentChapter + 1);
  }
}

function openChapterModal() {
  document.getElementById('chapter-modal').classList.add('show');
  updateChapterList();
}

function closeChapterModal() {
  document.getElementById('chapter-modal').classList.remove('show');
}

function updateChapterList() {
  const list = document.getElementById('chapter-list');
  list.innerHTML = '';
  
  story.chapters.forEach((chapter, i) => {
    const item = document.createElement('div');
    item.className = 'chapter-item';
    const isCompleted = story.chaptersCompleted.includes(i);
    
    if (i > story.currentChapter && !isCompleted) {
      item.classList.add('locked');
      item.innerHTML = `<strong>Capítulo ${i + 1}</strong><br><small>🔒 Bloqueado - Completa el capítulo anterior</small>`;
    } else {
      item.innerHTML = `<strong>Capítulo ${i + 1}: ${chapter.title}</strong><br><small>${i === story.currentChapter ? '📍 Leyendo ahora' : '✓ Completado'}</small>`;
      item.onclick = () => {
        loadChapter(i);
        closeChapterModal();
      };
    }
    list.appendChild(item);
  });
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
    }, isOpen ? 300 : 0);
  }
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
  
  // Actualizar pantalla principal del teléfono
  const timeLarge = document.querySelector('.phone-time-large');
  const dateLarge = document.querySelector('.phone-date-large');
  
  if (timeLarge) timeLarge.textContent = `${hours}:${minutes}`;
  if (dateLarge) dateLarge.textContent = `${day}, ${date} de ${month}`;
}



function openChat(contactId) {
  if (!currentCharacter) return; // Protección si no hay personaje
  
  const contact = chatDataByCharacter[currentCharacter][contactId];
  
  document.getElementById('contact-list').style.display = 'none';
  document.getElementById('chat-view').style.display = 'block';
  
  document.getElementById('chat-name').textContent = contact.name;
  document.getElementById('chat-avatar').textContent = contact.avatar;
  document.getElementById('chat-avatar').style.background = contact.color;
  
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

// ========== EVENT LISTENERS ==========

// Cerrar modal al hacer clic fuera
document.getElementById('chapter-modal').addEventListener('click', (e) => {
  if (e.target.id === 'chapter-modal') {
    closeChapterModal();
  }
});

// ========== INICIALIZACIÓN ==========

// Cargar capítulo inicial
loadChapter(0);

// Actualizar hora del teléfono
updatePhoneTime();
setInterval(updatePhoneTime, 60000); // Actualizar cada minuto

// ========== FUNCIONES DE APPS DEL TELÉFONO ==========

function openPhoneApp(appName) {
  document.getElementById('phone-lockscreen').style.display = 'none';
  document.getElementById('phone-app-view').style.display = 'flex';
  
  const content = document.getElementById('phone-app-content');
  const title = document.getElementById('phone-app-title');
  
  content.innerHTML = '';
  
  switch(appName) {
    case 'mensajes':
      title.textContent = '💬 Mensajes';
      content.innerHTML = document.getElementById('mensajes-tab').innerHTML;
      break;
      
    case 'llamadas':
      title.textContent = '📞 Llamadas';
      content.innerHTML = document.getElementById('llamadas-tab').innerHTML;
      break;
      
    case 'mapa':
      title.textContent = '🗺️ Mapa';
      content.innerHTML = document.getElementById('mapa-tab').innerHTML;
      break;
      
    case 'cartera':
      title.textContent = '💳 Cartera';
      content.innerHTML = document.getElementById('cartera-tab').innerHTML;
      break;
      
case 'notas':
      title.textContent = '📝 Notas';
      content.innerHTML = window.currentNotesContent || `
        <div style="padding: 10px;">
          <h4 style="color: #ff9800; margin-top: 0;">Mis Notas</h4>
          <p style="color: #999;">Selecciona un personaje para ver sus notas</p>
        </div>
      `;
      break;
      
     case 'busqueda':
  title.textContent = '🔍 Búsqueda';
  content.innerHTML = document.getElementById('busqueda-tab').innerHTML;
  break; 
      
  }
}

function closePhoneApp() {
  document.getElementById('phone-lockscreen').style.display = 'flex';
  document.getElementById('phone-app-view').style.display = 'none';
}

// ========== DATOS COMPLETOS DE PERSONAJES ==========

const charactersData = {
  izuku: {
    name: 'Izuku Midoriya',
    avatar: 'I',
    icon: '💚',
    color: 'linear-gradient(135deg, #4caf50, #8bc34a)',
    mood: 'Feliz',
    energy: 'Tranquilo',
    
    // Inventario de Izuku
    inventory: [
      {
        icon: '🎓',
        gradient: 'green-gradient',
        color: 'green-text',
        name: 'Carnet de U.A.',
        description: 'Identificación oficial de estudiante'
      },
      {
        icon: '📓',
        gradient: 'blue-gradient',
        color: 'blue-text',
        name: 'Cuaderno de Análisis de Héroes',
        description: 'N°13 - Lleno de notas y dibujos'
      },
      {
        icon: '⚡',
        gradient: 'orange-gradient',
        color: 'orange-text',
        name: 'Bebida Energética',
        description: 'x2 - Para entrenamientos intensos'
      },
      {
        icon: '📱',
        gradient: 'pink-gradient',
        color: 'pink-text',
        name: 'Smartphone',
        description: 'Con protector de All Might'
      },
      {
        icon: '🩹',
        gradient: 'purple-gradient',
        color: 'purple-text',
        name: 'Kit de Primeros Auxilios',
        description: 'Básico - Cortesía de Recovery Girl'
      }
    ],
    
    // Contactos de Izuku
    contacts: {
      umi: {
        name: 'Umi-chan 💕',
        avatar: '💗',
        color: 'umi-avatar',
        lastMessage: 'Te amo Izu-kun 💚',
        time: 'Ahora'
      },
      mama: {
        name: 'Mamá',
        avatar: 'M',
        color: 'mama-avatar',
        lastMessage: 'No olvides llamarme',
        time: 'Ayer'
      }
    },
    
    // Diario de Izuku
    diary: [
      {
        date: '21 de Noviembre',
        content: `
          <p><strong>Querido diario,</strong></p>
          <p>Hoy fue un día increíble en U.A. El entrenamiento con All Might está dando resultados, puedo sentir que cada vez controlo mejor el One For All.</p>
          <p>Umi-chan me mandó un mensaje muy lindo en el almuerzo... no puedo dejar de sonreír cuando pienso en ella 💚</p>
        `
      },
      {
        date: '20 de Noviembre',
        content: `
          <p>El examen de hoy fue más difícil de lo que pensaba. Kacchan estuvo especialmente competitivo, pero eso solo me motiva a esforzarme más.</p>
          <p>Necesito analizar las técnicas del héroe Mirko para mi siguiente reporte.</p>
        `
      }
 ],
    
    // Llamadas de Izuku
    calls: [
      {
        contact: 'Umi-chan 💕',
        avatar: '💗',
        color: 'umi-avatar',
        type: '📞 Llamada entrante',
        duration: '23 min',
        time: '12:15',
        recent: true
      },
      {
        contact: 'Umi-chan 💕',
        avatar: '💗',
        color: 'umi-avatar',
        type: '📱 Llamada saliente',
        duration: '15 min',
        time: 'Ayer',
        recent: false
      },
      {
        contact: 'Mamá',
        avatar: 'M',
        color: 'mama-avatar',
        type: '📞 Llamada entrante',
        duration: '8 min',
        time: 'Ayer',
        recent: false
      },
      {
        contact: 'Kacchan',
        avatar: 'K',
        color: 'kacchan-avatar',
        type: '❌ Llamada perdida',
        duration: '',
        time: '2 días',
        recent: false
      }
    ],
      // Ubicaciones de Izuku
    locations: {
      current: {
        name: 'U.A. High School',
        detail: 'Edificio Principal - Aula 1-A',
        icon: '🏫'
      },
      history: [
        {
          name: 'U.A. High School',
          detail: 'Ahora - 8:00 AM',
          icon: '🏫'
        },
        {
          name: 'Casa - Apartamento Midoriya',
          detail: '7:45 AM - 7:00 AM',
          icon: '🏠'
        },
        {
          name: 'Playa Takoba',
          detail: 'Ayer - 6:30 AM',
          icon: '🏖️'
        }
      ]
    },
    
    // Cartera de Izuku
    wallet: {
      cash: '¥3,450',
      suica: '¥1,200',
      tpoint: '850 pts',
      ponta: '420 pts',
      expenses: [
        { name: '🏪 Lawson - Almuerzo', amount: '-¥580', type: 'negative' },
        { name: '🚇 Metro (Suica)', amount: '-¥200', type: 'negative' },
        { name: '🏪 Family Mart - Bebida', amount: '-¥150', type: 'negative' },
        { name: '📚 Librería - Revista', amount: '-¥480', type: 'negative' },
        { name: '💰 Mesada semanal', amount: '+¥2,000', type: 'positive' }
      ]
    },
    
    // Notas de Izuku
    notes: [
      {
        title: 'Recordatorio',
        content: 'Estudiar para el examen de mañana',
        color: '#ff9800'
      },
      {
        title: 'Ideas para cita',
        content: 'Llevar a Umi-chan al nuevo café',
        color: '#ff9800'
      }
    ],
    
    // Búsquedas de Izuku
    searches: [
      {
        query: 'técnicas de control quirk para principiantes',
        time: 'Hace 2 horas'
      },
      {
        query: 'ideas de citas románticas en Musutafu',
        time: 'Ayer 20:15'
      },
      {
        query: 'cómo fortalecer músculos sin lastimarse',
        time: 'Ayer 6:30'
      },
      {
        query: 'historia de All Might primeras misiones',
        time: '2 días'
      },
      {
        query: 'diferencia entre héroe Pro y héroe novato',
        time: '3 días'
      },
      {
        query: 'qué regalar a tu novia en su cumpleaños',
        time: '1 semana'
      }
 ],
    
    // Timeline de Izuku (SIMPLE)
    timeline: [
      {
        time: 'Ahora - 8:00 AM',
        event: 'Clases en U.A. | Aula 1-A - Clase de Héroes',
        current: true
      },
      {
        time: '7:45 AM',
        event: 'Camino a la escuela | Encuentro con Uraraka y Iida',
        current: false
      },
      {
        time: '7:00 AM',
        event: 'Desayuno en casa | Mamá preparó mi comida favorita',
        current: false
      },
      {
        time: '6:00 AM',
        event: 'Entrenamiento matutino | Playa Takoba - 50 flexiones',
        current: false
      },
      {
        time: 'Ayer 20:30',
        event: 'Videollamada con Umi-chan | Conversamos por 1 hora',
        current: false
      }
    ]
    
    
  },
  
  harumi: {
    name: 'Harumi',
    avatar: 'H',
    icon: '💙',
    color: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
    mood: 'Alegre',
    energy: 'Energética',
    
    // Inventario de Harumi
    inventory: [
      {
        icon: '🎀',
        gradient: 'pink-gradient',
        color: 'pink-text',
        name: 'Horquilla Especial',
        description: 'Regalo de su mejor amiga'
      },
      {
        icon: '📚',
        gradient: 'purple-gradient',
        color: 'purple-text',
        name: 'Libros de Estrategia',
        description: 'x3 - Para estudiar tácticas'
      },
      {
        icon: '🎧',
        gradient: 'blue-gradient',
        color: 'blue-text',
        name: 'Audífonos Inalámbricos',
        description: 'Para entrenar con música'
      },
      {
        icon: '💊',
        gradient: 'orange-gradient',
        color: 'orange-text',
        name: 'Vitaminas',
        description: 'Suplemento diario'
      },
      {
        icon: '📱',
        gradient: 'pink-gradient',
        color: 'pink-text',
        name: 'Smartphone',
        description: 'Con funda morada'
      }
    ],
    
    // Contactos de Harumi
    contacts: {
      aiko: {
        name: 'Aiko-chan 🌸',
        avatar: '🌸',
        color: 'umi-avatar',
        lastMessage: 'Nos vemos mañana! 💕',
        time: 'Ahora'
      },
      papa: {
        name: 'Papá',
        avatar: 'P',
        color: 'mama-avatar',
        lastMessage: 'Cuídate mucho hija',
        time: 'Ayer'
      }
    },
    
    // Diario de Harumi
    diary: [
      {
        date: '21 de Noviembre',
        content: `
          <p><strong>Querido diario,</strong></p>
          <p>Hoy tuve un entrenamiento increíble. Siento que mi quirk está mejorando cada día más.</p>
          <p>Aiko-chan y yo fuimos a tomar un café después de clase. Me contó sobre su nuevo crush, fue muy divertido 💜</p>
        `
      },
      {
        date: '20 de Noviembre',
        content: `
          <p>La clase de estrategia fue intensa. Aprendí nuevas técnicas que definitivamente voy a practicar.</p>
          <p>Papá me llamó en la noche, siempre es lindo escuchar su voz.</p>
        `
      }
    ],
    
    // Llamadas de Harumi  
     calls: [
      {
        contact: 'Aiko-chan 🌸',
        avatar: '🌸',
        color: 'umi-avatar',
        type: '📞 Llamada entrante',
        duration: '45 min',
        time: '14:20',
        recent: true
      },
      {
        contact: 'Aiko-chan 🌸',
        avatar: '🌸',
        color: 'umi-avatar',
        type: '📱 Llamada saliente',
        duration: '23 min',
        time: 'Ayer',
        recent: false
      },
      {
        contact: 'Papá',
        avatar: 'P',
        color: 'mama-avatar',
        type: '📞 Llamada entrante',
        duration: '12 min',
        time: 'Ayer',
        recent: false
      },
      {
        contact: 'Mamá',
        avatar: 'M',
        color: 'kacchan-avatar',
        type: '❌ Llamada perdida',
        duration: '',
        time: '2 días',
        recent: false
      }
    ],
      // Ubicaciones de Harumi
    locations: {
      current: {
        name: 'U.A. High School',
        detail: 'Edificio de Entrenamiento - Gimnasio Gamma',
        icon: '🏫'
      },
      history: [
        {
          name: 'U.A. High School',
          detail: 'Ahora - 8:00 AM',
          icon: '🏫'
        },
        {
          name: 'Casa - Apartamento Takahashi',
          detail: '7:30 AM - 6:45 AM',
          icon: '🏠'
        },
        {
          name: 'Café Moonlight',
          detail: 'Ayer - 17:00',
          icon: '☕'
        }
      ]
    },  
     // Cartera de Harumi (SIN T-Point ni Ponta)
    wallet: {
      cash: '¥4,200',
      suica: '¥1,500',
      expenses: [
        { name: '☕ Café Moonlight - Con Aiko', amount: '-¥850', type: 'negative' },
        { name: '🚇 Metro (Suica)', amount: '-¥200', type: 'negative' },
        { name: '🏪 Family Mart - Snacks', amount: '-¥320', type: 'negative' },
        { name: '📚 Librería - Manga nuevo', amount: '-¥680', type: 'negative' },
        { name: '💰 Mesada semanal', amount: '+¥3,000', type: 'positive' }
      ]
    },
    
    // Notas de Harumi
    notes: [
      {
        title: 'Entrenamiento de esta semana',
        content: 'Practicar técnica de velocidad con el quirk',
        color: '#e91e63'
      },
      {
        title: 'Cumpleaños de Aiko',
        content: 'Comprar regalo el viernes - Le gusta la papelería linda',
        color: '#9c27b0'
      },
      {
        title: 'Lista de compras',
        content: 'Shampoo, acondicionador, vitaminas',
        color: '#ff9800'
      }
    ],
    // Búsquedas de Harumi
    searches: [
      {
        query: 'mejores técnicas de combate cuerpo a cuerpo',
        time: 'Hace 1 hora'
      },
      {
        query: 'cafés aesthetic en Musutafu',
        time: 'Ayer 19:30'
      },
      {
        query: 'cómo mejorar resistencia física',
        time: 'Ayer 7:00'
      },
      {
        query: 'héroes pro especializados en velocidad',
        time: '2 días'
      },
      {
        query: 'outfits lindos para entrenar',
        time: '3 días'
      },
      {
        query: 'qué regalar a tu mejor amiga',
        time: '1 semana'
      }
],
    
    // Timeline de Harumi (SIMPLE)
    timeline: [
      {
        time: 'Ahora - 8:00 AM',
        event: 'Entrenamiento en U.A. | Gimnasio Gamma - Entrenamiento de quirk',
        current: true
      },
      {
        time: '7:30 AM',
        event: 'Camino a la escuela | Encontré a Aiko en el metro',
        current: false
      },
      {
        time: '6:45 AM',
        event: 'Desayuno en casa | Preparé un smoothie de frutas',
        current: false
      },
      {
        time: '6:00 AM',
        event: 'Carrera matutina | Parque Central - 5km',
        current: false
      },
      {
        time: 'Ayer 19:30',
        event: 'Videollamada con Aiko | Hablamos sobre el examen',
        current: false
      }
    ]
  }
};

let currentCharacter = null; // Ahora inicia en null


// ========== FUNCIONES PARA ACTUALIZAR CONTENIDO ==========

function updateInventory(items) {
  const inventoryPanel = document.getElementById('inventario');
  const title = '<h3>🎒 Inventario</h3>';
  
  let html = title;
  
  items.forEach(item => {
    html += `
      <div class="panel-item">
        <div class="inventory-item">
          <div class="item-icon ${item.gradient}">${item.icon}</div>
          <div style="flex: 1;">
            <strong class="${item.color}">${item.name}</strong><br>
            <small>${item.description}</small>
          </div>
        </div>
      </div>
    `;
  });
  
  // Item bloqueado
  html += `
    <div class="panel-item locked">
      <div class="inventory-item">
        <div class="item-icon gray-bg">❓</div>
        <div style="flex: 1;">
          <strong>???</strong><br>
          <small>🔒 Objeto no desbloqueado</small>
        </div>
      </div>
    </div>
  `;
  
  inventoryPanel.innerHTML = html;
}

function updateContacts(contacts) {
  const contactList = document.querySelector('#mensajes-tab #contact-list');
  
  let html = '';
  
  Object.keys(contacts).forEach(key => {
    const contact = contacts[key];
    html += `
      <div class="panel-item contact-item" onclick="openChat('${key}')">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="contact-avatar ${contact.color}">${contact.avatar}</div>
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
  const diaryPanel = document.getElementById('diario');
  const charName = currentCharacter ? charactersData[currentCharacter].name : 'Usuario';
  const title = '<h3>📔 Diario de ' + charName + '</h3>';
  
  let html = title;
  
  entries.forEach(entry => {
    html += `
      <div class="diary-entry">
        <div class="diary-date">${entry.date}</div>
        <div class="diary-content">
          ${entry.content}
        </div>
      </div>
    `;
  });
  
  diaryPanel.innerHTML = html;
}

function updatePhoneCalls(calls) {
  const llamadasTab = document.getElementById('llamadas-tab');
  
  let html = '<h4 class="section-title">📞 Historial de llamadas</h4>';
  
  calls.forEach(call => {
    html += `
      <div class="call-item ${call.recent ? 'recent' : ''}">
        <div class="contact-avatar ${call.color}">${call.avatar}</div>
        <div style="flex: 1;">
          <strong ${call.recent ? 'style="color: #ff5fa2;"' : ''}>${call.contact}</strong><br>
          <small>${call.type}${call.duration ? ' · ' + call.duration : ''}</small>
        </div>
        <span class="call-time">${call.time}</span>
      </div>
    `;
  });
  
  llamadasTab.innerHTML = html;
}

function updatePhoneMap(locations) {
  const mapaTab = document.getElementById('mapa-tab');
  
  let html = `
    <div class="map-container">
      <div class="location-marker">📍 ${locations.current.name}</div>
    </div>
    <div style="margin-top: 15px;">
      <h4 class="section-title">📍 Ubicación actual</h4>
      <div class="location-current">
        <strong>${locations.current.name}</strong><br>
        <small>${locations.current.detail}</small>
      </div>

      <h4 class="section-title">🕐 Historial de ubicaciones</h4>
      <div class="location-history">
  `;
  
  locations.history.forEach(loc => {
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
  
  html += '</div></div>';
  mapaTab.innerHTML = html;
}

function updatePhoneWallet(wallet) {
  const carteraTab = document.getElementById('cartera-tab');
  
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
  
  // Solo mostrar T-Point y Ponta si existen (Izuku los tiene, Harumi no)
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
  carteraTab.innerHTML = html;
}

function updatePhoneNotes(notes) {
  const notasContent = `
    <div style="padding: 10px;">
      <h4 style="color: #ff9800; margin-top: 0;">Mis Notas</h4>
      ${notes.map(note => `
        <div style="background: #fff9e6; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 3px solid ${note.color};">
          <strong>${note.title}</strong><br>
          <small style="color: #666;">${note.content}</small>
        </div>
      `).join('')}
    </div>
  `;
  
  window.currentNotesContent = notasContent;
}

function updatePhoneSearches(searches) {
  const busquedaTab = document.getElementById('busqueda-tab');
  
  let html = '<h4 style="margin: 0 0 12px 0; color: #4caf50; font-size: 13px;">🔍 Historial de búsqueda</h4>';
  html += '<div style="font-size: 13px; color: #666;">';
  
  searches.forEach((search, index) => {
    const isFirst = index === 0;
    html += `
      <div style="padding: 10px; background: #f5f5f5; border-radius: 6px; margin-bottom: 6px; ${isFirst ? 'border-left: 3px solid #4caf50;' : ''}">
        <div style="font-weight: 500; color: #333;">${search.query}</div>
        <small style="color: #999;">${search.time}</small>
      </div>
    `;
  });
  
  html += '</div>';
  busquedaTab.innerHTML = html;
}

function updateTimeline(timeline) {
  const timelinePanel = document.getElementById('timeline');
  
  let html = '<h3>⏰ Línea de Tiempo</h3>';
  html += '<div class="timeline-container">';
  
  timeline.forEach(item => {
    html += `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-time">${item.time}</div>
          <div class="timeline-event ${item.current ? 'current' : ''}">
            ${item.event}
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  timelinePanel.innerHTML = html;
}

// ========== FUNCIONES DE SELECTOR ==========

function toggleCharacterSelector() {
  const panel = document.getElementById('character-selector-panel');
  panel.classList.toggle('show');
}

function selectCharacter(charId) {
  currentCharacter = charId;
  const char = charactersData[charId];
  
  // Mostrar sidebar y botón toggle
  document.getElementById('sidebar').classList.add('show');
  document.getElementById('sidebar-toggle').classList.add('show');
  
  // Actualizar icono del botón
  document.getElementById('current-character-icon').textContent = char.icon;
  
  // Actualizar perfil en sidebar
  document.querySelector('.profile-avatar').textContent = char.avatar;
  document.querySelector('.profile-avatar').style.background = char.color;
  document.querySelector('.profile-name').textContent = char.name;
  
  // Actualizar estados
  document.getElementById('mood-state').textContent = char.mood;
  document.getElementById('energy-state').textContent = char.energy;
  
  // Actualizar TODO el contenido
  updateInventory(char.inventory);
  updateContacts(char.contacts);
  updateDiary(char.diary);
  updatePhoneCalls(char.calls);
  updatePhoneMap(char.locations);
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


function toggleSidebar() {
  document.body.classList.toggle('sidebar-hidden');
}

// Cerrar selector al hacer clic fuera
document.addEventListener('click', (e) => {
  const panel = document.getElementById('character-selector-panel');
  const btn = document.getElementById('character-selector-btn');
  
  if (!panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('show');
  }
});

