# AI_Email_Sender

AI Email Sender
A simple full-stack application that leverages the power of Large Language Models to generate and send emails. The user provides a prompt, the AI generates the email body, the user can edit it, and then send it to the specified recipients.

This project was built as a timed assignment to demonstrate rapid development and full-stack capabilities.

✨ Key Features
AI-Powered Content Generation: Uses the Groq API with the Llama 3 model to generate email content based on a user's prompt.

Editable Output: The AI-generated email body is fully editable, allowing the user to make adjustments before sending.

Simple, Clean UI: A single-page interface built with vanilla JavaScript and styled with Tailwind CSS for a modern look and feel.

FastAPI Backend: A lightweight and high-performance Python backend to handle API requests.

Simulated Email Sending: A backend endpoint that simulates the email sending process, logging the details to the console.

🏗️ Architecture / Workflow
The application follows a simple client-server architecture. The frontend is a static HTML file that communicates with a Python backend, which in turn communicates with the external Groq AI service.

+--------------------------------+
|      User (in Browser)         |
|          (index.html)          |
+--------------------------------+
             |
             | 1. POST /generate-email (with prompt)
             v
+--------------------------------+
|    FastAPI Backend Server      |
|           (main.py)            |
+--------------------------------+
             |                     ^
             | 2. Sends prompt     | 3. Returns generated text
             | to Groq API         |
             v                     |
+--------------------------------+
|       Groq AI Service (LLM)    |
+--------------------------------+
             ^
             | 4. Returns generated text to Browser
             |
+--------------------------------+
|      User (in Browser)         |
| (Sees & edits generated text)  |
+--------------------------------+
             |
             | 5. POST /send-email (with final content)
             v
+--------------------------------+
|    FastAPI Backend Server      |
|   (Simulates send, returns     |
|         success message)       |
+--------------------------------+
             ^
             | 6. Returns success message to Browser
             |
+--------------------------------+
|      User (in Browser)         |
|   (Sees "Email Sent!" message) |
+--------------------------------+

🛠️ Tech Stack
Frontend:

HTML5

Tailwind CSS (via CDN)

Vanilla JavaScript (ES6)

Backend:

Python 3.9+

FastAPI

Uvicorn (ASGI Server)

AI Service:

Groq API (Llama 3 Model)

🚀 Getting Started
Prerequisites
Python 3.7+

An active Groq API Key, which you can get from console.groq.com
