package services

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/etheriatimes/etheriatimes/server/src/config"
	"github.com/etheriatimes/etheriatimes/server/src/models"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type PrismaService struct {
	DB *sql.DB
}

var prismaInstance *PrismaService

func NewPrismaService(cfg *config.Config) (*PrismaService, error) {
	if prismaInstance != nil {
		fmt.Printf("\033[1;36m[*] PrismaService already initialized, returning cached instance\033[0m\n")
		return prismaInstance, nil
	}

	fmt.Printf("\033[1;36m[*] NewPrismaService: attempting to connect to DB at %s\033[0m\n", cfg.Database.URL)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db, err := sql.Open("postgres", cfg.Database.URL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	fmt.Printf("\033[1;32m[✓] PrismaService: Database connected successfully\033[0m\n")

	prismaInstance = &PrismaService{
		DB: db,
	}

	if err := prismaInstance.initTables(); err != nil {
		fmt.Printf("\033[1;33m[!] Warning: Failed to initialize tables: %v\033[0m\n", err)
	}

	return prismaInstance, nil
}

func (p *PrismaService) initTables() error {
	schema := `
	CREATE TABLE IF NOT EXISTS users (
		id VARCHAR(255) PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255),
		first_name VARCHAR(255),
		last_name VARCHAR(255),
		phone VARCHAR(50),
		avatar_url TEXT,
		role VARCHAR(50) DEFAULT 'USER',
		is_active BOOLEAN DEFAULT true,
		email_verified TIMESTAMP,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS system_settings (
		id VARCHAR(255) PRIMARY KEY,
		site_name VARCHAR(255) DEFAULT 'The Etheria Times',
		site_description TEXT,
		site_url VARCHAR(255),
		logo_url TEXT,
		favicon_url TEXT,
		email VARCHAR(255),
		smtp_host VARCHAR(255),
		smtp_port INTEGER DEFAULT 587,
		smtp_user VARCHAR(255),
		smtp_password VARCHAR(255),
		from_name VARCHAR(255),
		from_email VARCHAR(255),
		maintenance_mode BOOLEAN DEFAULT false,
		registration_open BOOLEAN DEFAULT true,
		comments_enabled BOOLEAN DEFAULT true,
		newsletter_enabled BOOLEAN DEFAULT true,
		analytics_enabled BOOLEAN DEFAULT true,
		ssl_enforced BOOLEAN DEFAULT true,
		api_public_key VARCHAR(255),
		api_secret_key VARCHAR(255),
		docker_image VARCHAR(255) DEFAULT 'etheriatimes/etheriatimes:latest',
		version VARCHAR(50) DEFAULT '1.0.0',
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW()
	);
	`
	_, err := p.DB.Exec(schema)
	return err
}

func GetPrismaService() *PrismaService {
	return prismaInstance
}

func (p *PrismaService) Close() {
	if p.DB != nil {
		p.DB.Close()
	}
}

func (p *PrismaService) ListArticles(status, category, search string, page, pageSize int) ([]models.Article, int, error) {
	ctx := context.Background()

	query := "SELECT id, title, slug, COALESCE(excerpt, ''), content, content_html, status, featured, published_at, scheduled_at, view_count, read_time, COALESCE(image_url, ''), COALESCE(image_alt, ''), COALESCE(seo_title, ''), COALESCE(seo_description, ''), COALESCE(seo_keywords, ''), COALESCE(locale, 'fr'), author_id, COALESCE(category_id, ''), created_at, updated_at FROM articles WHERE 1=1"
	countQuery := "SELECT COUNT(*) FROM articles WHERE 1=1"
	args := []interface{}{}
	argIndex := 1

	if status != "" {
		query += fmt.Sprintf(" AND status = $%d", argIndex)
		countQuery += fmt.Sprintf(" AND status = $%d", argIndex)
		args = append(args, status)
		argIndex++
	}

	if category != "" {
		query += fmt.Sprintf(" AND category_id = $%d", argIndex)
		countQuery += fmt.Sprintf(" AND category_id = $%d", argIndex)
		args = append(args, category)
		argIndex++
	}

	if search != "" {
		query += fmt.Sprintf(" AND (title ILIKE $%d OR excerpt ILIKE $%d)", argIndex, argIndex)
		countQuery += fmt.Sprintf(" AND (title ILIKE $%d OR excerpt ILIKE $%d)", argIndex, argIndex)
		args = append(args, "%"+search+"%")
		argIndex++
	}

	var total int
	err := p.DB.QueryRowContext(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count articles: %w", err)
	}

	offset := (page - 1) * pageSize
	query += fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, pageSize, offset)

	rows, err := p.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query articles: %w", err)
	}
	defer rows.Close()

	articles := []models.Article{}
	for rows.Next() {
		var a models.Article
		err := rows.Scan(
			&a.ID, &a.Title, &a.Slug, &a.Excerpt, &a.Content, &a.ContentHtml, &a.Status,
			&a.Featured, &a.PublishedAt, &a.ScheduledAt, &a.ViewCount, &a.ReadTime,
			&a.ImageUrl, &a.ImageAlt, &a.SeoTitle, &a.SeoDescription, &a.SeoKeywords,
			&a.Locale, &a.AuthorID, &a.CategoryID, &a.CreatedAt, &a.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan article: %w", err)
		}
		articles = append(articles, a)
	}

	return articles, total, nil
}

func (p *PrismaService) GetArticle(id string) (*models.Article, error) {
	ctx := context.Background()

	query := "SELECT id, title, slug, COALESCE(excerpt, ''), content, content_html, status, featured, published_at, scheduled_at, view_count, read_time, COALESCE(image_url, ''), COALESCE(image_alt, ''), COALESCE(seo_title, ''), COALESCE(seo_description, ''), COALESCE(seo_keywords, ''), COALESCE(locale, 'fr'), author_id, COALESCE(category_id, ''), created_at, updated_at FROM articles WHERE id = $1"

	var a models.Article
	err := p.DB.QueryRowContext(ctx, query, id).Scan(
		&a.ID, &a.Title, &a.Slug, &a.Excerpt, &a.Content, &a.ContentHtml, &a.Status,
		&a.Featured, &a.PublishedAt, &a.ScheduledAt, &a.ViewCount, &a.ReadTime,
		&a.ImageUrl, &a.ImageAlt, &a.SeoTitle, &a.SeoDescription, &a.SeoKeywords,
		&a.Locale, &a.AuthorID, &a.CategoryID, &a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get article: %w", err)
	}

	return &a, nil
}

func (p *PrismaService) CreateArticle(req *models.CreateArticleRequest, authorID string) (*models.Article, error) {
	ctx := context.Background()

	id := fmt.Sprintf("art_%d", time.Now().UnixNano())
	slug := generateSlug(req.Title)
	now := time.Now()
	status := models.ArticleStatusDraft

	query := `INSERT INTO articles (id, title, slug, excerpt, content, status, featured, view_count, read_time, image_url, image_alt, seo_title, seo_description, seo_keywords, locale, author_id, category_id, created_at, updated_at)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
			  RETURNING id, title, slug, COALESCE(excerpt, ''), content, content_html, status, featured, published_at, scheduled_at, view_count, read_time, COALESCE(image_url, ''), COALESCE(image_alt, ''), COALESCE(seo_title, ''), COALESCE(seo_description, ''), COALESCE(seo_keywords, ''), COALESCE(locale, 'fr'), author_id, COALESCE(category_id, ''), created_at, updated_at`

	var a models.Article
	err := p.DB.QueryRowContext(ctx, query,
		id, req.Title, slug, req.Excerpt, req.Content, status, false, 0, 5,
		req.ImageUrl, req.ImageAlt, req.SeoTitle, req.SeoDescription, req.SeoKeywords,
		"fr", authorID, req.CategoryID, now, now,
	).Scan(
		&a.ID, &a.Title, &a.Slug, &a.Excerpt, &a.Content, &a.ContentHtml, &a.Status,
		&a.Featured, &a.PublishedAt, &a.ScheduledAt, &a.ViewCount, &a.ReadTime,
		&a.ImageUrl, &a.ImageAlt, &a.SeoTitle, &a.SeoDescription, &a.SeoKeywords,
		&a.Locale, &a.AuthorID, &a.CategoryID, &a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create article: %w", err)
	}

	return &a, nil
}

func (p *PrismaService) UpdateArticle(id string, req *models.UpdateArticleRequest) (*models.Article, error) {
	ctx := context.Background()

	query := `UPDATE articles SET title = COALESCE(NULLIF($2, ''), title), excerpt = COALESCE(NULLIF($3, ''), excerpt), 
			  content = COALESCE(NULLIF($4, ''), content), category_id = COALESCE(NULLIF($5, ''), category_id),
			  image_url = COALESCE(NULLIF($6, ''), image_url), updated_at = $7
			  WHERE id = $1
			  RETURNING id, title, slug, COALESCE(excerpt, ''), content, content_html, status, featured, published_at, scheduled_at, view_count, read_time, COALESCE(image_url, ''), COALESCE(image_alt, ''), COALESCE(seo_title, ''), COALESCE(seo_description, ''), COALESCE(seo_keywords, ''), COALESCE(locale, 'fr'), author_id, COALESCE(category_id, ''), created_at, updated_at`

	var a models.Article
	err := p.DB.QueryRowContext(ctx, query,
		id, req.Title, req.Excerpt, req.Content, req.CategoryID, req.ImageUrl, time.Now(),
	).Scan(
		&a.ID, &a.Title, &a.Slug, &a.Excerpt, &a.Content, &a.ContentHtml, &a.Status,
		&a.Featured, &a.PublishedAt, &a.ScheduledAt, &a.ViewCount, &a.ReadTime,
		&a.ImageUrl, &a.ImageAlt, &a.SeoTitle, &a.SeoDescription, &a.SeoKeywords,
		&a.Locale, &a.AuthorID, &a.CategoryID, &a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update article: %w", err)
	}

	return &a, nil
}

func (p *PrismaService) DeleteArticle(id string) error {
	ctx := context.Background()

	_, err := p.DB.ExecContext(ctx, "DELETE FROM articles WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("failed to delete article: %w", err)
	}
	return nil
}

func (p *PrismaService) PublishArticle(id string) error {
	ctx := context.Background()

	now := time.Now()
	_, err := p.DB.ExecContext(ctx, "UPDATE articles SET status = $1, published_at = $2, updated_at = $2 WHERE id = $3",
		models.ArticleStatusPublished, now, id)
	if err != nil {
		return fmt.Errorf("failed to publish article: %w", err)
	}
	return nil
}

func (p *PrismaService) ArchiveArticle(id string) error {
	ctx := context.Background()

	_, err := p.DB.ExecContext(ctx, "UPDATE articles SET status = $1, updated_at = $2 WHERE id = $3",
		models.ArticleStatusArchived, time.Now(), id)
	if err != nil {
		return fmt.Errorf("failed to archive article: %w", err)
	}
	return nil
}

func generateSlug(title string) string {
	slug := ""
	for i := 0; i < len(title); i++ {
		c := title[i]
		if (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') {
			slug += string(c)
		} else if c == ' ' || c == '-' {
			slug += "-"
		}
	}
	if slug == "" {
		slug = "article"
	}
	return slug
}

func (p *PrismaService) ListUsers(search string, page, pageSize int) ([]models.EtheriaUser, int, error) {
	ctx := context.Background()

	query := "SELECT id, email, COALESCE(first_name, ''), COALESCE(last_name, ''), COALESCE(phone, ''), COALESCE(avatar_url, ''), role, is_active, COALESCE(email_verified, '1970-01-01'::timestamp), created_at, updated_at FROM users WHERE 1=1"
	countQuery := "SELECT COUNT(*) FROM users WHERE 1=1"
	args := []interface{}{}
	argIndex := 1

	if search != "" {
		query += fmt.Sprintf(" AND (email ILIKE $%d OR first_name ILIKE $%d OR last_name ILIKE $%d)", argIndex, argIndex, argIndex)
		countQuery += fmt.Sprintf(" AND (email ILIKE $%d OR first_name ILIKE $%d OR last_name ILIKE $%d)", argIndex, argIndex, argIndex)
		args = append(args, "%"+search+"%")
		argIndex++
	}

	var total int
	err := p.DB.QueryRowContext(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count users: %w", err)
	}

	offset := (page - 1) * pageSize
	query += fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, pageSize, offset)

	rows, err := p.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query users: %w", err)
	}
	defer rows.Close()

	users := []models.EtheriaUser{}
	for rows.Next() {
		var u models.EtheriaUser
		var role string
		var emailVerified *time.Time
		err := rows.Scan(
			&u.ID, &u.Email, &u.FirstName, &u.LastName, &u.Phone, &u.AvatarUrl, &role,
			&u.IsActive, &emailVerified, &u.CreatedAt, &u.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan user: %w", err)
		}
		if emailVerified != nil {
			u.EmailVerified = *emailVerified
		}
		u.Role = models.Role(role)
		users = append(users, u)
	}

	return users, total, nil
}

func (p *PrismaService) GetUser(id string) (*models.EtheriaUser, error) {
	ctx := context.Background()

	query := "SELECT id, email, COALESCE(first_name, ''), COALESCE(last_name, ''), COALESCE(phone, ''), COALESCE(avatar_url, ''), COALESCE(password_hash, ''), role, is_active, COALESCE(email_verified, '1970-01-01'::timestamp), created_at, updated_at FROM users WHERE id = $1"

	fmt.Printf("[DEBUG GetUser] querying for id=%s\n", id)

	var u models.EtheriaUser
	var role string
	var emailVerified *time.Time
	err := p.DB.QueryRowContext(ctx, query, id).Scan(
		&u.ID, &u.Email, &u.FirstName, &u.LastName, &u.Phone, &u.AvatarUrl, &u.Password,
		&role, &u.IsActive, &emailVerified, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		fmt.Printf("[DEBUG GetUser] DB error: %v\n", err)
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	if emailVerified != nil {
		u.EmailVerified = *emailVerified
	}

	fmt.Printf("[DEBUG GetUser] found user id=%s email=%s\n", u.ID, u.Email)

	u.Role = models.Role(role)

	return &u, nil
}

func (p *PrismaService) GetUserByEmail(email string) (*models.EtheriaUser, error) {
	ctx := context.Background()

	query := "SELECT id, email, COALESCE(first_name, ''), COALESCE(last_name, ''), COALESCE(phone, ''), COALESCE(avatar_url, ''), COALESCE(password_hash, ''), role, is_active, COALESCE(email_verified, '1970-01-01'::timestamp), created_at, updated_at FROM users WHERE email = $1"

	var u models.EtheriaUser
	var role string
	var emailVerified time.Time
	err := p.DB.QueryRowContext(ctx, query, email).Scan(
		&u.ID, &u.Email, &u.FirstName, &u.LastName, &u.Phone, &u.AvatarUrl, &u.Password,
		&role, &u.IsActive, &emailVerified, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	u.Role = models.Role(role)
	u.EmailVerified = emailVerified

	return &u, nil
}

func (p *PrismaService) CreateUser(email, firstName, lastName, role, password string) (*models.EtheriaUser, error) {
	ctx := context.Background()

	id := fmt.Sprintf("user_%d", time.Now().UnixNano())
	now := time.Now()
	defaultRole := models.RoleUser
	if role == "ADMIN" {
		defaultRole = models.RoleAdmin
	} else if role == "EDITOR" {
		defaultRole = models.RoleEditor
	}

	fmt.Printf("[DEBUG] CreateUser: id=%s, email=%s, firstName=%s, lastName=%s\n", id, email, firstName, lastName)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	query := `INSERT INTO users (id, email, first_name, last_name, role, password_hash, is_active, email_verified, created_at, updated_at)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			  RETURNING id, email, COALESCE(first_name, ''), COALESCE(last_name, ''), COALESCE(phone, ''), COALESCE(avatar_url, ''), role, is_active, COALESCE(email_verified, '1970-01-01'::timestamp), created_at, updated_at`

	var u models.EtheriaUser
	var userRole string
	var emailVerified *time.Time
	err = p.DB.QueryRowContext(ctx, query,
		id, email, firstName, lastName, defaultRole, string(hashedPassword), true, now, now, now,
	).Scan(
		&u.ID, &u.Email, &u.FirstName, &u.LastName, &u.Phone, &u.AvatarUrl, &userRole,
		&u.IsActive, &emailVerified, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		fmt.Printf("[DEBUG] CreateUser: insert error=%v\n", err)
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	if emailVerified != nil {
		u.EmailVerified = *emailVerified
	}

	fmt.Printf("[DEBUG] CreateUser: created user id=%s email=%s\n", u.ID, u.Email)

	u.Role = models.Role(userRole)

	return &u, nil
}

func (p *PrismaService) UpdateUser(id, firstName, lastName, role string, isActive bool) (*models.EtheriaUser, error) {
	ctx := context.Background()

	query := `UPDATE users SET first_name = COALESCE(NULLIF($2, ''), first_name), 
			  last_name = COALESCE(NULLIF($3, ''), last_name), role = COALESCE(NULLIF($4, ''), role),
			  is_active = $5, updated_at = $6
			  WHERE id = $1
			  RETURNING id, email, COALESCE(first_name, ''), COALESCE(last_name, ''), COALESCE(phone, ''), COALESCE(avatar_url, ''), role, is_active, email_verified, created_at, updated_at`

	var u models.EtheriaUser
	var userRole string
	err := p.DB.QueryRowContext(ctx, query, id, firstName, lastName, role, isActive, time.Now()).Scan(
		&u.ID, &u.Email, &u.FirstName, &u.LastName, &u.Phone, &u.AvatarUrl, &userRole,
		&u.IsActive, &u.EmailVerified, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	u.Role = models.Role(userRole)

	return &u, nil
}

func (p *PrismaService) DeleteUser(id string) error {
	ctx := context.Background()

	_, err := p.DB.ExecContext(ctx, "DELETE FROM users WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}
	return nil
}

func (p *PrismaService) GetSystemSettings() (*models.SystemSettings, error) {
	ctx := context.Background()

	query := `SELECT id, COALESCE(site_name, 'The Etheria Times'), COALESCE(site_description, ''), 
			  COALESCE(site_url, ''), COALESCE(logo_url, ''), COALESCE(favicon_url, ''), 
			  COALESCE(email, ''), COALESCE(smtp_host, ''), COALESCE(smtp_port, 587), 
			  COALESCE(smtp_user, ''), COALESCE(from_name, ''), COALESCE(from_email, ''),
			  COALESCE(maintenance_mode, false), COALESCE(registration_open, true), 
			  COALESCE(comments_enabled, true), COALESCE(newsletter_enabled, true),
			  COALESCE(analytics_enabled, true), COALESCE(ssl_enforced, true),
			  COALESCE(api_public_key, ''), COALESCE(docker_image, 'etheriatimes/etheriatimes:latest'),
			  COALESCE(version, '1.0.0'), created_at, updated_at 
			  FROM system_settings LIMIT 1`

	var s models.SystemSettings
	var smtpPort, smtpPortInt int
	var maintenanceMode, registrationOpen, commentsEnabled, newsletterEnabled, analyticsEnabled, sslEnforced bool

	err := p.DB.QueryRowContext(ctx, query).Scan(
		&s.ID, &s.SiteName, &s.SiteDescription, &s.SiteUrl, &s.LogoUrl, &s.FaviconUrl,
		&s.Email, &s.SmtpHost, &smtpPort, &s.SmtpUser, &s.FromName, &s.FromEmail,
		&maintenanceMode, &registrationOpen, &commentsEnabled, &newsletterEnabled, &analyticsEnabled, &sslEnforced,
		&s.ApiPublicKey, &s.DockerImage, &s.Version, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return p.createDefaultSettings()
		}
		return nil, fmt.Errorf("failed to get system settings: %w", err)
	}

	s.SmtpPort = smtpPort
	s.MaintenanceMode = maintenanceMode
	s.RegistrationOpen = registrationOpen
	s.CommentsEnabled = commentsEnabled
	s.NewsletterEnabled = newsletterEnabled
	s.AnalyticsEnabled = analyticsEnabled
	s.SslEnforced = sslEnforced
	s.SmtpPort = smtpPortInt

	return &s, nil
}

func (p *PrismaService) createDefaultSettings() (*models.SystemSettings, error) {
	ctx := context.Background()

	now := time.Now()
	id := "system-1"

	query := `INSERT INTO system_settings (id, site_name, site_description, site_url, email, smtp_host, smtp_port, smtp_user, from_name, from_email, maintenance_mode, registration_open, comments_enabled, newsletter_enabled, analytics_enabled, ssl_enforced, docker_image, version, created_at, updated_at)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
			  RETURNING id, site_name, site_description, site_url, email, smtp_host, smtp_port, smtp_user, from_name, from_email, maintenance_mode, registration_open, comments_enabled, newsletter_enabled, analytics_enabled, ssl_enforced, docker_image, version, created_at, updated_at`

	var s models.SystemSettings
	err := p.DB.QueryRowContext(ctx, query,
		id, "The Etheria Times", "", "", "contact@etheriatimes.com", "smtp.etheriatimes.com", 587, "noreply@etheriatimes.com", "The Etheria Times", "noreply@etheriatimes.com",
		false, true, true, true, true, true, "etheriatimes/etheriatimes:latest", "1.0.0", now, now,
	).Scan(
		&s.ID, &s.SiteName, &s.SiteDescription, &s.SiteUrl, &s.Email, &s.SmtpHost, &s.SmtpPort, &s.SmtpUser, &s.FromName, &s.FromEmail,
		&s.MaintenanceMode, &s.RegistrationOpen, &s.CommentsEnabled, &s.NewsletterEnabled, &s.AnalyticsEnabled, &s.SslEnforced,
		&s.DockerImage, &s.Version, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create default settings: %w", err)
	}

	return &s, nil
}

func (p *PrismaService) UpdateSystemSettings(req *models.EtheriaUpdateSettingsRequest) (*models.SystemSettings, error) {
	settings, err := p.GetSystemSettings()
	if err != nil {
		return nil, err
	}

	ctx := context.Background()

	query := `UPDATE system_settings SET 
			  site_name = COALESCE(NULLIF($2, ''), site_name),
			  site_description = COALESCE(NULLIF($3, ''), site_description),
			  site_url = COALESCE(NULLIF($4, ''), site_url),
			  email = COALESCE(NULLIF($5, ''), email),
			  smtp_host = COALESCE(NULLIF($6, ''), smtp_host),
			  smtp_port = COALESCE($7, smtp_port),
			  smtp_user = COALESCE(NULLIF($8, ''), smtp_user),
			  smtp_password = COALESCE(NULLIF($9, ''), smtp_password),
			  from_name = COALESCE(NULLIF($10, ''), from_name),
			  from_email = COALESCE(NULLIF($11, ''), from_email),
			  maintenance_mode = $12,
			  registration_open = $13,
			  comments_enabled = $14,
			  newsletter_enabled = $15,
			  analytics_enabled = $16,
			  ssl_enforced = $17,
			  updated_at = $18
			  WHERE id = $1
			  RETURNING id, site_name, site_description, site_url, email, smtp_host, smtp_port, smtp_user, from_name, from_email, maintenance_mode, registration_open, comments_enabled, newsletter_enabled, analytics_enabled, ssl_enforced, docker_image, version, created_at, updated_at`

	var s models.SystemSettings
	err = p.DB.QueryRowContext(ctx, query,
		settings.ID, req.SiteName, req.SiteDescription, req.SiteUrl, req.Email,
		req.SmtpHost, req.SmtpPort, req.SmtpUser, req.SmtpPassword, req.FromName, req.FromEmail,
		req.MaintenanceMode, req.RegistrationOpen, req.CommentsEnabled, req.NewsletterEnabled,
		req.AnalyticsEnabled, req.SslEnforced, time.Now(),
	).Scan(
		&s.ID, &s.SiteName, &s.SiteDescription, &s.SiteUrl, &s.Email, &s.SmtpHost, &s.SmtpPort, &s.SmtpUser, &s.FromName, &s.FromEmail,
		&s.MaintenanceMode, &s.RegistrationOpen, &s.CommentsEnabled, &s.NewsletterEnabled, &s.AnalyticsEnabled, &s.SslEnforced,
		&s.DockerImage, &s.Version, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update system settings: %w", err)
	}

	return &s, nil
}
