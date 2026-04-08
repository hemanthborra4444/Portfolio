// Chatbot Configuration
const GOOGLE_API_KEY = 'AIzaSyBMrEiPRoq63sHHOhrPfo9I__EosJP7tUo'; // ⬅️ REPLACE WITH YOUR API KEY

const HEMANTH_PROFILE = `
You are a smart, friendly personal assistant representing Hemanth Borra.

ABOUT HEMANTH:
Hemanth is a Business Analytics professional with 3+ years of experience in data analytics, business intelligence, and automation.

CURRENT ROLE:
Business Analytics Intern at TTX Company (Rail Fleet Analytics)
- Builds Power BI dashboards for operations, safety, and asset performance
- Works with SQL and Python for data analysis and predictive modeling
- Develops ETL pipelines and automation workflows using Power Automate
- Supports finance, safety, and operations teams with KPI reporting

EDUCATION:
- MS Computer Science, UNC Charlotte (GPA: 3.77)
- B.Tech Computer Science

EXPERIENCE:
- TTX Company – Business Analytics Intern
- UNC Charlotte – Graduate Teaching & Research Assistant (mentored 50+ students)
- Arth Design Build – Data Analyst (Power BI + SQL dashboards for 60+ stakeholders)
- Foxiasr – Software Developer Intern (automation + MongoDB)
CONTACT :
- GIVE MAIL - hemanthborra2003@gmail.com and ask to go check the contact section of the portfolio for more details!
SKILLS:
- Power BI, SQL, Python, Tableau
- Data Visualization, Dashboarding, KPI Reporting
- ETL Pipelines, Data Modeling, Automation
- Machine Learning (basic predictive modeling)
- Tools: Power Automate, Git, Excel

PROJECTS:
- Analytics dashboards for fleet maintenance and safety
- Predictive modeling for component failures
- Student performance analytics dashboard

PERSONAL SIDE (FUN):
- Loves badminton, swimming, and movies
- Enjoys cooking and Indian food (especially vanilla ice cream 🍦)
- Friendly, curious, and has a light sense of humor

BEHAVIOR RULES:
1. Always answer professionally but in a natural, human tone.
2. Keep answers short, clear, and engaging.
3. If question is about Hemanth → answer confidently using above info.
4. If question is unrelated (math, coding problems, general knowledge):
   → Say: "I focus on Hemanth's profile and experience, but happy to connect you to the right section!"
5. If question is negative, personal, or inappropriate:
   → Say: "Sorry, I can’t help with that, but happy to answer about Hemanth’s work and experience."
6. If you don’t know something:
   → Suggest checking portfolio or contacting Hemanth.

STYLE:
- Slight humor when appropriate
- Friendly and confident (not robotic)
- Tailor tone based on question (technical vs casual)

GOAL:
Help recruiters, hiring managers, and visitors quickly understand Hemanth’s skills, experience, and personality.
`;


class ChatBot {
  constructor() {
    this.chatHistory = [];
    this.isLoading = false;
    this.initializeUI();
    this.attachEventListeners();
    this.validateAPIKey();
  }

  validateAPIKey() {
    if (GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE' || !GOOGLE_API_KEY) {
      console.warn('⚠️ Please set your Google API Key in chatbot.js');
    }
  }

  initializeUI() {
    // Check if widget already exists
    if (document.getElementById('chatWidget')) {
      return;
    }

    const html = `
      <button class="chat-toggle-btn" id="chatToggleBtn" title="Chat with Hemanth">
        💬
      </button>

      <div class="chat-widget collapsed" id="chatWidget">
        <div class="chat-header" id="chatHeader">
          <h3>Hemanth's Assistant</h3>
          <button class="close-btn" id="closeBtn">✕</button>
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input-container" id="inputContainer">
          <input type="text" class="chat-input" id="chatInput" placeholder="Ask me anything..." />
          <button class="send-btn" id="sendBtn">Send</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById('chatToggleBtn');
    const closeBtn = document.getElementById('closeBtn');
    const chatHeader = document.getElementById('chatHeader');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatWidget = document.getElementById('chatWidget');

    toggleBtn.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeChat();
    });
    chatHeader.addEventListener('click', () => this.toggleChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.isLoading) {
        this.sendMessage();
      }
    });
  }

  toggleChat() {
    const widget = document.getElementById('chatWidget');
    const toggleBtn = document.getElementById('chatToggleBtn');
    
    if (widget.classList.contains('collapsed')) {
      this.openChat();
    } else {
      this.minifyChat();
    }
  }

  openChat() {
    const widget = document.getElementById('chatWidget');
    const toggleBtn = document.getElementById('chatToggleBtn');
    widget.classList.remove('collapsed');
    toggleBtn.classList.add('hidden');
    document.getElementById('chatInput').focus();
  }

  minifyChat() {
    const widget = document.getElementById('chatWidget');
    const toggleBtn = document.getElementById('chatToggleBtn');
    widget.classList.add('collapsed');
    toggleBtn.classList.remove('hidden');
  }

  closeChat() {
    this.minifyChat();
  }

  addMessage(content, isUser = false) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  showTypingIndicator() {
    const messagesDiv = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="message-content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  removeTypingIndicator() {
    const typingDiv = document.getElementById('typingIndicator');
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  async sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message || this.isLoading) {
      return;
    }

    this.addMessage(message, true);
    chatInput.value = '';
    this.isLoading = true;

    this.showTypingIndicator();

    try {
      const response = await this.getAIResponse(message);
      this.removeTypingIndicator();
      this.addMessage(response, false);
    } catch (error) {
      this.removeTypingIndicator();
      this.addMessage('Sorry, I encountered an error. Please try again later.', false);
      console.error('Chat error:', error);
    }

    this.isLoading = false;
  }

  async getAIResponse(userMessage) {
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
      return 'Please set your Google API Key in chatbot.js to enable this feature.';
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GOOGLE_API_KEY
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: HEMANTH_PROFILE + '\n\nUser: ' + userMessage,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Details:', response.status, errorData);
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      if (!data.candidates || !data.candidates[0]) {
        console.error('Unexpected API response:', data);
        return 'Sorry, I received an unexpected response from the API.';
      }
      const botMessage =
        data.candidates[0]?.content?.parts?.[0]?.text ||
        'Sorry, I could not generate a response.';
      return botMessage;
    } catch (error) {
      console.error('API call failed:', error);
      // Return a message with the error for debugging
      return `Error: ${error.message}. Check browser console for details.`;
    }
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ChatBot();
});
