# Flowchart Email Scheduler

## Overview
This project is a web application for scheduling and sending emails based on a flowchart. It allows users to create flowcharts representing email sequences and schedule emails to be sent automatically based on the flowchart logic.

## Features
- **Flowchart Creation**: Users can create flowcharts representing email sequences using a drag-and-drop interface.
- **Email Scheduling**: Emails can be scheduled to be sent automatically based on the flowchart logic, including delays and conditional branching.
- **Authentication Protected Routes**: Certain routes are protected by authentication to ensure data security.
- **Agenda Integration**: The backend uses Agenda to handle the scheduling and sending of emails.
- **Nodemailer Integration**: Nodemailer is used to send emails.

## Setup Instructions

### Frontend
1. Clone the repository.
2. Navigate to the `frontend` directory.
3. Install dependencies using `npm install`.
4. Start the development server using `npm start`.

### Backend
1. Navigate to the `backend` directory.
2. Install dependencies using `npm install`.
3. Set up environment variables by creating a `.env` file in the root directory and adding the required variables.
4. Start the backend server using `npm start`.

### API Routes
- **Schedule Email**: `POST /api/schedule` - Schedule an email to be sent.
- **Get Email Status**: `GET /api/emails` - Get the status of scheduled emails.

## Technologies Used
- React for the frontend
- Node.js and Express.js for the backend
- MongoDB for data storage
- React Flow for the flowchart UI
- Nodemailer for sending emails
- Agenda for scheduling emails
