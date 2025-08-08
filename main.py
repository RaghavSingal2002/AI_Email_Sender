# main.py
# To run this backend: uvicorn main:app --reload

import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import groq 

# --- Pydantic Models for Request Bodies ---
class EmailPrompt(BaseModel):
    prompt: str

class EmailContent(BaseModel):
    recipients: List[str]
    subject: str
    body: str

# --- FastAPI App Initialization ---
app = FastAPI()

# --- CORS Middleware ---
# This allows your HTML/JS frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins for simplicity in this assignment
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

# --- Groq API Client ---
# IMPORTANT: Paste your API key here.
# In a real project, this would be an environment variable.
try:
    groq_api_key = "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" 
    
    if not groq_api_key or groq_api_key == "YOUR_GROQ_API_KEY_HERE":
        raise ValueError("Groq API key is missing. Please add it to main.py")
        
    client = groq.Groq(api_key=groq_api_key)

except Exception as e:
    print(f"Error initializing Groq client: {e}")
    client = None

# --- API Endpoints ---
@app.get("/")
def read_root():
    """ Root endpoint to check if the server is running. """
    return {"status": "AI Email Sender API is running!"}

@app.post("/generate-email")
async def generate_email(email_prompt: EmailPrompt):
    """
    Receives a prompt and uses the Groq AI model to generate the email body.
    """
    if not client:
        raise HTTPException(status_code=500, detail="Groq API client is not initialized. Check API key.")

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that writes professional and friendly emails. Generate only the body of the email based on the user's prompt. Do not include a subject line or any preamble."
                },
                {
                    "role": "user",
                    "content": email_prompt.prompt,
                }
            ],
            model="llama3-8b-8192",
        )
        generated_body = chat_completion.choices[0].message.content
        return {"email_body": generated_body}

    except Exception as e:
        print(f"An error occurred with the Groq API: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate email from AI service.")


@app.post("/send-email")
async def send_email(email_content: EmailContent):
    """
    This is a SIMULATED email sending endpoint. For this assignment,
    it prints the details to the console to prove functionality without
    complex email server setup.
    """
    print("--- SIMULATING EMAIL SEND ---")
    print(f"Recipients: {', '.join(email_content.recipients)}")
    print(f"Subject: {email_content.subject}")
    print("--- Body ---")
    print(email_content.body)
    print("-----------------------------")
    
    return {"message": f"Email successfully sent to {len(email_content.recipients)} recipient(s)!"}
