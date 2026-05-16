# 🛡️ VeriNews AI - News Authenticity Platform

VeriNews AI is a state-of-the-art fact-checking platform designed to combat misinformation in real-time. Powered by **Google Gemini 2.5 Flash**, it provides users with deep insights into news articles, headlines, and URLs, evaluating them for accuracy, bias, and sensationalism.

---

## 🚀 Features

*   **🔍 Triple-Mode Verification**: Analyze news via raw text, headlines, or direct URLs (automated web scraping).
*   **⚖️ Bias Indicator**: Identifies ideological leanings (Left-leaning, Right-leaning, Centrist, or Unbiased).
*   **📢 Sensationalism Meter**: Detects clickbait, exaggeration, and emotional manipulation.
*   **⚡ Global Caching (Redis)**: Lightning-fast responses for viral content and reduced API costs via an intelligent caching layer.
*   **📊 Analytics Dashboard**: Track your verification history and explore authenticity trends.
*   **📱 Responsive UI**: Seamless experience across mobile, tablet, and desktop devices.
*   **🤖 AI Chatbot**: Built-in support agent to help users navigate results and learn about media literacy.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS** (Premium UI/UX)
- **React Router & Context API**
- **Lucide Icons**

### Backend
- **FastAPI** (High-performance Python framework)
- **SQLAlchemy** (Database ORM)
- **Pydantic** (Data validation)
- **BeautifulSoup4** (Web scraping)

### AI & Infrastructure
- **Google Gemini 2.5 Flash** (via LangChain)
- **Redis** (Global Caching)
- **Google OAuth 2.0** (Secure Authentication)

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/verinews-ai.git
cd verinews-ai
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder:
```env
DATABASE_URL=sqlite:///./support_desk.db
GEMINI_API_KEY=your_gemini_key_here
SECRET_KEY=your_secret_key
REDIS_URL=redis://localhost:6379/0  # Optional: Defaults to In-Memory fallback
```

Run the backend:
```bash
python -m uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run the frontend:
```bash
npm run dev
```

---

## 📂 Project Structure

```text
VeriNews-AI/
├── backend/            # FastAPI Backend
│   ├── app/
│   │   ├── api/        # Endpoints (Auth, News, Tickets)
│   │   ├── services/   # AI (Gemini) & Cache Logic
│   │   └── models.py   # Database Schema
│   └── main.py         # Entry point
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   └── pages/      # View layouts (Verify, History, Dash)
│   └── index.html
└── .gitignore          # Root security config
```

---

## 🤝 Contributing
Contributions are welcome! If you have suggestions to improve the AI prompts or UI, please open an issue or submit a pull request.

## 📄 License
This project is licensed under the MIT License.

---

*Made with ❤️ to promote truth and accuracy in the digital age.*
