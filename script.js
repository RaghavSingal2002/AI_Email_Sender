// --- DOM Elements ---
const recipientsInput = document.getElementById('recipients');
const subjectInput = document.getElementById('subject');
const promptInput = document.getElementById('prompt');
const generateBtn = document.getElementById('generateBtn');
const generateBtnText = document.getElementById('generateBtnText');
const generateLoader = document.getElementById('generateLoader');

const emailEditorDiv = document.getElementById('email-editor');
const emailBodyTextarea = document.getElementById('emailBody');
const sendBtn = document.getElementById('sendBtn');
const sendBtnText = document.getElementById('sendBtnText');
const sendLoader = document.getElementById('sendLoader');

const messageBox = document.getElementById('messageBox');

// --- API Endpoint ---
// IMPORTANT: Make sure your FastAPI server is running on this address
const API_URL = 'http://127.0.0.1:8000';

// --- Event Listeners ---
generateBtn.addEventListener('click', handleGenerateEmail);
sendBtn.addEventListener('click', handleSendEmail);

// --- Functions ---
async function handleGenerateEmail() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showMessage('Please enter a prompt for the email.', 'error');
        return;
    }

    setLoading(generateBtn, generateBtnText, generateLoader, true);
    
    try {
        // This is where we call our FastAPI backend
        const response = await fetch(`${API_URL}/generate-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error('Failed to generate email. The server might be down.');
        }

        const data = await response.json();
        emailBodyTextarea.value = data.email_body;
        emailEditorDiv.classList.remove('hidden');
        showMessage('Email generated successfully! You can now edit and send it.', 'success');

    } catch (error) {
        console.error('Error generating email:', error);
        showMessage(error.message, 'error');
    } finally {
        setLoading(generateBtn, generateBtnText, generateLoader, false);
    }
}

async function handleSendEmail() {
    const recipients = recipientsInput.value.trim();
    const subject = subjectInput.value.trim();
    const body = emailBodyTextarea.value.trim();

    if (!recipients || !subject || !body) {
        showMessage('Please fill in all fields: recipients, subject, and email body.', 'error');
        return;
    }
    
    setLoading(sendBtn, sendBtnText, sendLoader, true);

    try {
        // This calls the backend to "send" the email
        const response = await fetch(`${API_URL}/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipients: recipients.split(',').map(email => email.trim()),
                subject: subject,
                body: body
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send email. The server might be down.');
        }
        
        const data = await response.json();
        showMessage(data.message, 'success');

    } catch (error) {
        console.error('Error sending email:', error);
        showMessage(error.message, 'error');
    } finally {
        setLoading(sendBtn, sendBtnText, sendLoader, false);
    }
}

function setLoading(button, textElement, loaderElement, isLoading) {
    button.disabled = isLoading;
    textElement.style.display = isLoading ? 'none' : 'inline';
    loaderElement.classList.toggle('hidden', !isLoading);
}

function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = 'p-4 rounded-md text-sm'; // Reset classes
    
    if (type === 'success') {
        messageBox.classList.add('bg-green-100', 'text-green-800');
    } else {
        messageBox.classList.add('bg-red-100', 'text-red-800');
    }
}
