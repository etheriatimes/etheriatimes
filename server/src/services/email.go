package services

import (
	"fmt"
	"net/smtp"
	"strings"

	"github.com/etheriatimes/etheriatimes/server/src/models"
)

type EmailService struct {
	smtpHost     string
	smtpPort     int
	smtpUser     string
	smtpPassword string
	fromName     string
	fromEmail    string
}

func NewEmailService(settings *models.SystemSettings) *EmailService {
	return &EmailService{
		smtpHost:     settings.SmtpHost,
		smtpPort:     settings.SmtpPort,
		smtpUser:     settings.SmtpUser,
		smtpPassword: settings.SmtpPassword,
		fromName:     settings.FromName,
		fromEmail:    settings.FromEmail,
	}
}

func (e *EmailService) SendEmail(to, subject, body string) error {
	if e.smtpHost == "" {
		return fmt.Errorf("SMTP not configured")
	}

	from := e.fromEmail
	if from == "" {
		from = e.smtpUser
	}

	msg := buildEmail(from, to, e.fromName, subject, body)

	addr := fmt.Sprintf("%s:%d", e.smtpHost, e.smtpPort)

	var auth smtp.Auth
	if e.smtpUser != "" {
		auth = smtp.PlainAuth("", e.smtpUser, e.smtpPassword, e.smtpHost)
	}

	err := smtp.SendMail(addr, auth, from, []string{to}, []byte(msg))
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}

func (e *EmailService) SendWelcomeEmail(to, firstName string) error {
	subject := "Bienvenue sur The Etheria Times"
	body := fmt.Sprintf(`Bonjour %s,

Bienvenue sur The Etheria Times !

Votre compte a été créé avec succès. Vous pouvez maintenant accéder à toutes nos fonctionnalités.

Cordialement,
L'équipe The Etheria Times`, firstName)

	return e.SendEmail(to, subject, body)
}

func (e *EmailService) SendPasswordResetEmail(to, resetToken string) error {
	subject := "Réinitialisation de votre mot de passe"
	body := fmt.Sprintf(`Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe.

Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe:
https://etheriatimes.com/reset-password?token=%s

Ce lien expire dans 1 heure.

Si vous n'avez pas fait cette demande, ignorez cet email.

Cordialement,
L'équipe The Etheria Times`, resetToken)

	err := e.SendEmail(to, subject, body)
	if err != nil {
		fmt.Printf("[ERROR] Failed to send password reset email: %v\n", err)
		return err
	}
	return nil
}

func (e *EmailService) SendNewsletterConfirmation(to, token string) error {
	subject := "Confirme ton inscription à la newsletter"
	body := fmt.Sprintf(`Bonjour,

Merci de confirmer votre inscription à notre newsletter.

Cliquez sur le lien ci-dessous:
https://etheriatimes.com/newsletter/confirm?token=%s

Cordialement,
L'équipe The Etheria Times`, token)

	return e.SendEmail(to, subject, body)
}

func buildEmail(from, to, fromName, subject, body string) string {
	var msg strings.Builder
	msg.WriteString("From: " + fromName + " <" + from + ">\n")
	msg.WriteString("To: " + to + "\n")
	msg.WriteString("Subject: " + subject + "\n")
	msg.WriteString("MIME-Version: 1.0\n")
	msg.WriteString("Content-Type: text/plain; charset=UTF-8\n")
	msg.WriteString("\n")
	msg.WriteString(body)
	return msg.String()
}

func SendEmailWithSettings(settings *models.SystemSettings, to, subject, body string) error {
	if settings.SmtpHost == "" {
		return fmt.Errorf("SMTP not configured")
	}

	emailService := NewEmailService(settings)
	return emailService.SendEmail(to, subject, body)
}
