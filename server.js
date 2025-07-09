import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// const express = require('express');
// const puppeteer = require('puppeteer');
// const path = require('path');
// const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission and generate PDF
app.post('/generate-pdf', async (req, res) => {
    try {
        console.log('Received request to generate PDF:', req.body);
        const { fullName, fatherName, propertySize, saleAmount, date } = req.body;

        // Validate required fields
        if (!fullName || !fatherName || !propertySize || !saleAmount || !date) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // HTML template for the Sale Deed
        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sale Deed</title>
            <style>
                body {
                    font-family: 'Times New Roman', serif;
                    line-height: 1.6;
                    margin: 40px;
                    background-color: #fff;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 20px;
                }
                .title {
                    font-size: 24px;
                    font-weight: bold;
                    text-decoration: underline;
                    margin-bottom: 10px;
                }
                .content {
                    font-size: 16px;
                    text-align: justify;
                    margin: 20px 0;
                    padding: 20px;
                    border: 1px solid #ddd;
                    background-color: #fafafa;
                }
                .highlight {
                    font-weight: bold;
                    color: #2c3e50;
                }
                .footer {
                    margin-top: 50px;
                    display: flex;
                    justify-content: space-between;
                }
                .signature {
                    text-align: center;
                    border-top: 1px solid #333;
                    padding-top: 10px;
                    width: 200px;
                }
                .date-section {
                    text-align: right;
                    margin-top: 30px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">SALE DEED</div>
                <p>Property Transfer Document</p>
            </div>

            <div class="content">
                <p>This Sale Deed is made on <span class="highlight">{{date}}</span> between <span class="highlight">{{name}}</span>, S/o <span class="highlight">{{father_name}}</span>, for a property of <span class="highlight">{{property_size}} sq.ft.</span>, sold for <span class="highlight">₹{{sale_amount}}</span>.</p>
                
                <p>WHEREAS, the vendor is the absolute owner of the property described herein and has good right, title, and interest in the same.</p>
                
                <p>WHEREAS, the vendor has agreed to sell and the purchaser has agreed to purchase the said property for the consideration amount mentioned above.</p>
                
                <p>NOW THIS DEED WITNESSETH that in consideration of the sum of <span class="highlight">₹{{sale_amount}}</span> paid by the purchaser to the vendor, the vendor hereby sells, transfers, and conveys unto the purchaser all his right, title, and interest in the property measuring <span class="highlight">{{property_size}} sq.ft.</span></p>
                
                <p>The vendor hereby covenants with the purchaser that he has good right to sell the said property and that the property is free from all encumbrances.</p>
            </div>

            <div class="date-section">
                Date: {{date}}
            </div>

            <div class="footer">
                <div class="signature">
                    <div>Vendor</div>
                    <div>{{name}}</div>
                </div>
                <div class="signature">
                    <div>Purchaser</div>
                    <div>_________________</div>
                </div>
                <div class="signature">
                    <div>Witness</div>
                    <div>_________________</div>
                </div>
            </div>
        </body>
        </html>
        `;

        // Replace placeholders with actual data
        const filledTemplate = htmlTemplate
            .replace(/{{name}}/g, fullName)
            .replace(/{{father_name}}/g, fatherName)
            .replace(/{{property_size}}/g, propertySize)
            .replace(/{{sale_amount}}/g, saleAmount)
            .replace(/{{date}}/g, date);

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(filledTemplate);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `sale-deed-${fullName.replace(/\s+/g, '-')}-${timestamp}.pdf`;
        const filepath = path.join(uploadsDir, filename);

        await page.pdf({
            path: filepath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();

        // Send the PDF file as download
        res.sendFile(filepath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ error: 'Error sending PDF' });
            } else {
                // Clean up
                setTimeout(() => {
                    fs.unlink(filepath, (unlinkErr) => {
                        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
                    });
                }, 10000);
            }
        });


    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});