import express from "express";
import cors from "cors";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
  res.status(200).send("🚀 Sua API está funcionando perfeitamente!");
});

app.post("/send-email", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    console.log("📩 Recebido novo envio:", { name, email, message });

    // 1️⃣ Enviar email para você
    const emailToMe = await resend.emails.send({
      from: "Enviado do Portfólio <onboarding@resend.dev>",
      to: "wandersonsa1110@gmail.com",
      subject: `Novo contato de ${name}`,
      reply_to: email,
      html: `
        <h2>Nova mensagem do seu site portfólio</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <blockquote>${message}</blockquote>
      `,
    });

    console.log("✅ Email enviado para você:", emailToMe);

    // 2️⃣ Auto-reply para o visitante
    const emailToVisitor = await resend.emails.send({
      from: "Enviado do Portfólio <onboarding@resend.dev>",
      to: email,
      subject: "Recebemos sua mensagem ✅",
      html: `
        <h2>Olá ${name},</h2>
        <p>Recebemos sua mensagem e entraremos em contato em até 24h.</p>
        <p><strong>Sua mensagem:</strong></p>
        <blockquote>${message}</blockquote>
        <p>Obrigado por entrar em contato!<br/>Equipe do Portfólio</p>
      `,
    });

    console.log("📨 Auto-reply enviado:", emailToVisitor);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Erro ao enviar email:", err);
    return res.status(500).json({ error: "Erro ao enviar email" });
  }
});

app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`));
