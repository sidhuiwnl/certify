import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import {templates} from "./email.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});


app.post("/send-email", async (req, res) => {

    const { to,name,role } = req.body;
    console.log(req.body);

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject : templates[role].subject,
            html: templates[role].body(name,to),
        });
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.post("/send-email/certificate", async (req, res) => {
    const { to,studentName,courseName,grade,institutionName,issueDate,completionDate,certificateId} = req.body;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject : templates.certificateTemplate.subject,
            html: templates.certificateTemplate.body(studentName,courseName,grade,institutionName,issueDate,completionDate,certificateId),
        });
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send email" });
    }
});



app.post("/send-email/verifier", async (req, res) => {
    const { to,verifierName,studentName,courseName,institutionName,issueDate,certificateId} = req.body;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject : templates.verificationRequest.subject,
            html: templates.verificationRequest.body(verifierName,studentName,courseName,institutionName,issueDate,certificateId),
        });
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
