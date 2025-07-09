# 🧾 Sale Deed Generator

A full-stack web application that generates professional **sale deed PDF documents** instantly from form input, using Node.js, Express, and Puppeteer.

---

## 🚀 Complete Solution Overview

### 🛠 Tech Stack
- **Backend**: Node.js + Express.js
- **PDF Generation**: Puppeteer (headless Chrome rendering)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern, responsive UI with gradients and clean layout

---

## 📋 Key Features

### ✅ 5-Field Sale Deed Form
Captures user input with validation:
- Full Name
- Father's Name
- Property Size (sq.ft.)
- Sale Amount (₹)
- Date

### ✅ Template Processing
Dynamic HTML template matching exact format:
> "This Sale Deed is made on **{{date}}** between **{{name}}**, S/o **{{father_name}}**, for a property of **{{property_size}} sq.ft.**, sold for **₹{{sale_amount}}**"

### ✅ PDF Generation & Instant Download
- Converts the HTML into a high-quality PDF using Puppeteer
- Automatically triggers a download in the browser
- Professional layout and formatting for legal documents

---

## 📁 Project Structure

sale-deed-generator/
├── server.js # Express server & Puppeteer logic
├── package.json # Project metadata & dependencies
├── README.md # Documentation (this file)
├── public/ # Static frontend assets
│ ├── index.html # Form UI
│ ├── styles.css # Responsive styling
│ └── script.js # Form logic & fetch request
└── uploads/ # Temporary folder to store generated PDFs

yaml
Copy
Edit

---

## 🎨 Design Highlights

- 🌈 **Modern UI** with clean gradients and readable layout
- 📱 **Responsive**: Works across desktop & mobile devices
- ⚙️ **Loading states**, form validation, and success feedback
- 📄 **Professional PDF** formatting suitable for legal use

---

## 🧪 Sample PDF Output

The generated PDF includes:
- Centered **title and header**
- Dynamic content injected into structured template
- Legal-style language for property transfer
- Signature areas for **Vendor**, **Purchaser**, and **Witness**
- Proper spacing and typography

---

## 🛠️ Setup Instructions

### 1️⃣ Clone and Install
```bash
git clone https://github.com/your-username/sale-deed-generator.git
cd sale-deed-generator
npm install
2️⃣ Start the Server
bash
npm start
3️⃣ Open in Browser
Visit: http://localhost:3000