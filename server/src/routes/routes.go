package routes

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/etheriatimes/website/server/src/middleware"
	"github.com/etheriatimes/website/server/src/models"
	"github.com/etheriatimes/website/server/src/services"
	"github.com/gin-gonic/gin"
)

// SetupRoutes configure toutes les routes API
// C'est le point d'entrée principal pour la configuration des routes
func SetupRoutes(router *gin.Engine, jwtService *services.JWTService) {
	authMiddleware := middleware.NewAuthMiddleware(jwtService)

	api := router.Group("/api/v1")
	{
		// ==================== AUTH (Aether Account) ====================
		authHandler := NewAuthHandler(jwtService)
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/register", authHandler.Register)
			auth.POST("/logout", authHandler.Logout)
			auth.POST("/refresh", authHandler.Refresh)
			auth.POST("/change-password", authMiddleware.RequireAuth(), authHandler.ChangePassword)
			auth.POST("/reset-password", authHandler.ResetPassword)
		}

		// ==================== ACCOUNT ====================
		account := api.Group("/account")
		{
			account.GET("/me", authMiddleware.RequireAuth(), authHandler.GetAccount)
		}

		// ==================== PROFILE ====================
		profileHandler := NewProfileHandler()
		profile := api.Group("/profile")
		profile.Use(authMiddleware.RequireAuth())
		{
			profile.GET("/", profileHandler.GetProfile)
			profile.PUT("/", profileHandler.UpdateProfile)
			profile.POST("/avatar", profileHandler.UploadAvatar)
		}

		// ==================== PASSWORDS ====================
		passwordHandler := NewPasswordHandler()
		passwords := api.Group("/passwords")
		passwords.Use(authMiddleware.RequireAuth())
		{
			passwords.GET("/", passwordHandler.ListPasswords)
			passwords.POST("/", passwordHandler.CreatePassword)
			passwords.GET("/:id", passwordHandler.GetPassword)
			passwords.PUT("/:id", passwordHandler.UpdatePassword)
			passwords.DELETE("/:id", passwordHandler.DeletePassword)
		}

		// ==================== SECURITY ====================
		securityHandler := NewSecurityHandler()
		security := api.Group("/security")
		security.Use(authMiddleware.RequireAuth())
		{
			security.GET("/", securityHandler.GetSecurityInfo)
			security.GET("/devices", securityHandler.GetDevices)
			security.GET("/sessions", securityHandler.GetSessions)
			security.GET("/activities", securityHandler.GetActivities)
			security.POST("/devices/:id/trust", securityHandler.TrustDevice)
			security.DELETE("/devices/:id", securityHandler.RevokeDevice)
			security.DELETE("/sessions/:id", securityHandler.RevokeSession)
			security.POST("/2fa/enable", securityHandler.EnableTwoFactor)
			security.POST("/2fa/disable", securityHandler.DisableTwoFactor)
			security.POST("/2fa/verify", securityHandler.VerifyTwoFactor)
		}

		// ==================== THIRD PARTY ====================
		thirdPartyHandler := NewThirdPartyHandler()
		thirdParty := api.Group("/third-party")
		thirdParty.Use(authMiddleware.RequireAuth())
		{
			thirdParty.GET("/", thirdPartyHandler.ListApps)
			thirdParty.POST("/", thirdPartyHandler.ConnectApp)
			thirdParty.DELETE("/:id", thirdPartyHandler.RevokeApp)
		}

		// ==================== CONTACTS ====================
		contactHandler := NewContactHandler()
		contacts := api.Group("/contacts")
		contacts.Use(authMiddleware.RequireAuth())
		{
			contacts.GET("/", contactHandler.ListContacts)
			contacts.POST("/", contactHandler.CreateContact)
			contacts.GET("/:id", contactHandler.GetContact)
			contacts.PUT("/:id", contactHandler.UpdateContact)
			contacts.DELETE("/:id", contactHandler.DeleteContact)
			contacts.GET("/groups", contactHandler.ListGroups)
			contacts.POST("/groups", contactHandler.CreateGroup)
		}

		// ==================== PRIVACY ====================
		privacyHandler := NewPrivacyHandler()
		privacy := api.Group("/privacy")
		privacy.Use(authMiddleware.RequireAuth())
		{
			privacy.GET("/", privacyHandler.GetPrivacySettings)
			privacy.PUT("/", privacyHandler.UpdatePrivacySettings)
			privacy.POST("/export", privacyHandler.ExportData)
			privacy.POST("/delete", privacyHandler.DeleteAccount)
		}

		// ==================== ETHERIA TIMES (Articles, Categories, etc.) ====================
		etheriaHandler := NewEtheriaHandlers(jwtService)

		// Articles
		articles := api.Group("/articles")
		{
			articles.GET("", etheriaHandler.ListArticles)
			articles.GET("/:id", etheriaHandler.GetArticle)
			articles.GET("/slug/:slug", etheriaHandler.GetArticleBySlug)
			articles.POST("", authMiddleware.RequireAuth(), etheriaHandler.CreateArticle)
			articles.PUT("/:id", authMiddleware.RequireAuth(), etheriaHandler.UpdateArticle)
			articles.DELETE("/:id", authMiddleware.RequireAuth(), etheriaHandler.DeleteArticle)
			articles.POST("/:id/publish", authMiddleware.RequireAuth(), etheriaHandler.PublishArticle)
			articles.POST("/:id/archive", authMiddleware.RequireAuth(), etheriaHandler.ArchiveArticle)
			articles.POST("/:id/feature", authMiddleware.RequireAuth(), etheriaHandler.ToggleFeatured)
		}

		// Categories
		categories := api.Group("/categories")
		{
			categories.GET("", etheriaHandler.ListCategories)
			categories.GET("/:id", etheriaHandler.GetCategory)
			categories.POST("", authMiddleware.RequireAuth(), etheriaHandler.CreateCategory)
			categories.PUT("/:id", authMiddleware.RequireAuth(), etheriaHandler.UpdateCategory)
			categories.DELETE("/:id", authMiddleware.RequireAuth(), etheriaHandler.DeleteCategory)
		}

		// Comments
		comments := api.Group("/comments")
		{
			comments.GET("/article/:articleId", etheriaHandler.ListComments)
			comments.POST("", authMiddleware.RequireAuth(), etheriaHandler.CreateComment)
			comments.PUT("/:id", authMiddleware.RequireAuth(), etheriaHandler.UpdateComment)
			comments.DELETE("/:id", authMiddleware.RequireAuth(), etheriaHandler.DeleteComment)
			comments.POST("/:id/flag", authMiddleware.RequireAuth(), etheriaHandler.FlagComment)
			comments.POST("/:id/approve", authMiddleware.RequireAuth(), etheriaHandler.ApproveComment)
		}

		// User (Bookmarks, History, Notifications, Subscription)
		users := api.Group("/user")
		users.Use(authMiddleware.RequireAuth())
		{
			users.GET("/bookmarks", etheriaHandler.ListBookmarks)
			users.POST("/bookmarks", etheriaHandler.AddBookmark)
			users.DELETE("/bookmarks/:articleId", etheriaHandler.RemoveBookmark)
			users.GET("/history", etheriaHandler.ListReadingHistory)
			users.POST("/history", etheriaHandler.AddToHistory)
			users.DELETE("/history", etheriaHandler.ClearHistory)
			users.DELETE("/history/:articleId", etheriaHandler.RemoveFromHistory)
			users.GET("/notifications", etheriaHandler.ListNotifications)
			users.PUT("/notifications/:id/read", etheriaHandler.MarkNotificationRead)
			users.PUT("/notifications/read-all", etheriaHandler.MarkAllNotificationsRead)
			users.DELETE("/notifications/:id", etheriaHandler.DeleteNotification)
			users.GET("/subscription", etheriaHandler.GetSubscription)
			users.POST("/subscription", etheriaHandler.CreateSubscription)
			users.PUT("/subscription", etheriaHandler.UpdateSubscription)
			users.POST("/subscription/cancel", etheriaHandler.CancelSubscription)
		}

		// Media
		media := api.Group("/media")
		media.Use(authMiddleware.RequireAuth())
		{
			media.GET("", etheriaHandler.ListMedia)
			media.POST("", etheriaHandler.UploadMedia)
			media.DELETE("/:id", etheriaHandler.DeleteMedia)
		}

		// Settings (System)
		settings := api.Group("/settings")
		settings.Use(authMiddleware.RequireAuth())
		{
			settings.GET("", etheriaHandler.GetSettings)
			settings.PUT("", etheriaHandler.UpdateSettings)
			settings.POST("/test-email", etheriaHandler.TestEmailConfig)
		}

		// Admin Users
		adminUsers := api.Group("/admin/users")
		adminUsers.Use(authMiddleware.RequireAuth())
		{
			adminUsers.GET("", etheriaHandler.ListUsers)
			adminUsers.GET("/:id", etheriaHandler.GetUser)
			adminUsers.PUT("/:id", etheriaHandler.UpdateUser)
			adminUsers.DELETE("/:id", etheriaHandler.DeleteUser)
		}
	}
}

// ==================== AUTH HANDLERS ====================

type AuthHandler struct {
	jwtService *services.JWTService
}

func NewAuthHandler(jwt *services.JWTService) *AuthHandler {
	return &AuthHandler{jwtService: jwt}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request: " + err.Error()})
		return
	}

	token, err := h.jwtService.GenerateToken("user-123", "account-123", req.Email, req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.AuthResponse{Success: false, Error: "Failed to generate token"})
		return
	}

	refreshToken, err := h.jwtService.GenerateRefreshToken("user-123")
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.AuthResponse{Success: false, Error: "Failed to generate refresh token"})
		return
	}

	user := &models.User{ID: "user-123", Email: req.Email, Active: true}
	c.JSON(http.StatusOK, models.AuthResponse{
		Success: true,
		Data: &models.TokenResponse{
			AccessToken: token, RefreshToken: refreshToken, TokenType: "Bearer",
			ExpiresIn: h.jwtService.GetExpirySeconds(), User: user,
		},
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, models.AuthResponse{Success: true, Message: "Logged out successfully"})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var req models.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request"})
		return
	}

	userID, err := h.jwtService.ValidateRefreshToken(req.RefreshToken)
	if err != nil || userID == "" {
		c.JSON(http.StatusUnauthorized, models.AuthResponse{Success: false, Error: "Invalid or expired refresh token"})
		return
	}

	token, _ := h.jwtService.GenerateToken(userID, "account-123", "user@example.com", "user")
	refreshToken, _ := h.jwtService.GenerateRefreshToken(userID)

	c.JSON(http.StatusOK, models.AuthResponse{
		Success: true,
		Data: &models.TokenResponse{
			AccessToken: token, RefreshToken: refreshToken, TokenType: "Bearer",
			ExpiresIn: h.jwtService.GetExpirySeconds(),
		},
	})
}

func (h *AuthHandler) ChangePassword(c *gin.Context) {
	var req models.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.AuthResponse{Success: true, Message: "Password changed successfully"})
}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req models.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.AuthResponse{Success: true, Message: "Password reset email sent"})
}

func (h *AuthHandler) GetAccount(c *gin.Context) {
	userID := c.GetString("userID")
	user := &models.User{
		ID:     userID,
		Active: true,
	}
	c.JSON(http.StatusOK, models.AuthResponse{
		Success: true,
		Data:    &models.TokenResponse{User: user},
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request: " + err.Error()})
		return
	}

	user := &models.User{
		ID:     "new-user-id",
		Email:  req.Email,
		Active: true,
	}

	c.JSON(http.StatusCreated, models.AuthResponse{
		Success: true,
		Data:    &models.TokenResponse{User: user},
		Message: "Registration successful",
	})
}

// ==================== PROFILE HANDLERS ====================

type ProfileHandler struct{}

func NewProfileHandler() *ProfileHandler { return &ProfileHandler{} }

type ProfileResponse struct {
	Success bool         `json:"success"`
	Data    *ProfileData `json:"data,omitempty"`
	Error   string       `json:"error,omitempty"`
}

type ProfileData struct {
	ID          string    `json:"id"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	Email       string    `json:"email"`
	Gender      string    `json:"gender"`
	Phone       string    `json:"phone"`
	BirthDate   string    `json:"birth_date"`
	Language    string    `json:"language"`
	AvatarURL   string    `json:"avatar_url"`
	AetherID    string    `json:"aether_id"`
	AccountType string    `json:"account_type"`
	Addresses   []Address `json:"addresses"`
	CreatedAt   string    `json:"created_at"`
}

type Address struct {
	ID        string `json:"id"`
	Label     string `json:"label"`
	Value     string `json:"value"`
	IsPrimary bool   `json:"is_primary"`
}

type UpdateProfileRequest struct {
	FirstName string    `json:"first_name,omitempty"`
	LastName  string    `json:"last_name,omitempty"`
	Gender    string    `json:"gender,omitempty"`
	Phone     string    `json:"phone,omitempty"`
	BirthDate string    `json:"birth_date,omitempty"`
	Language  string    `json:"language,omitempty"`
	Addresses []Address `json:"addresses,omitempty"`
}

func (h *ProfileHandler) GetProfile(c *gin.Context) {
	userID := c.GetString("userID")

	profile := ProfileData{
		ID:        userID,
		Addresses: []Address{},
	}
	c.JSON(http.StatusOK, ProfileResponse{Success: true, Data: &profile})
}

func (h *ProfileHandler) UpdateProfile(c *gin.Context) {
	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ProfileResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, ProfileResponse{Success: true})
}

func (h *ProfileHandler) UploadAvatar(c *gin.Context) {
	c.JSON(http.StatusOK, ProfileResponse{Success: true})
}

// ==================== PASSWORD HANDLERS ====================

type PasswordHandler struct{}

func NewPasswordHandler() *PasswordHandler { return &PasswordHandler{} }

func (h *PasswordHandler) ListPasswords(c *gin.Context) {
	c.JSON(http.StatusOK, models.PasswordListResponse{Success: true, Data: []models.Password{}})
}

func (h *PasswordHandler) GetPassword(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.PasswordResponse{Success: false, Error: "Password ID required"})
		return
	}
	c.JSON(http.StatusOK, models.PasswordResponse{Success: true, Data: models.Password{ID: id}})
}

func (h *PasswordHandler) CreatePassword(c *gin.Context) {
	var req models.CreatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.PasswordResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusCreated, models.PasswordResponse{Success: true, Data: models.Password{ID: "new-id", Name: req.Name}})
}

func (h *PasswordHandler) UpdatePassword(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.PasswordResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.PasswordResponse{Success: true, Data: models.Password{ID: id}})
}

func (h *PasswordHandler) DeletePassword(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.PasswordResponse{Success: false, Error: "Password ID required"})
		return
	}
	c.JSON(http.StatusOK, models.PasswordResponse{Success: true})
}

// ==================== SECURITY HANDLERS ====================

type SecurityHandler struct{}

func NewSecurityHandler() *SecurityHandler { return &SecurityHandler{} }

func (h *SecurityHandler) GetSecurityInfo(c *gin.Context) {
	data := models.SecurityData{
		Devices:          []models.Device{},
		Sessions:         []models.Session{},
		Activities:       []models.SecurityActivity{},
		TwoFactor:        models.TwoFactorConfig{Enabled: false},
		PasskeyEnabled:   false,
		SecureNavigation: false,
	}
	c.JSON(http.StatusOK, models.SecurityResponse{Success: true, Data: &data})
}

func (h *SecurityHandler) GetDevices(c *gin.Context) {
	c.JSON(http.StatusOK, models.DevicesResponse{Success: true, Data: []models.Device{}})
}

func (h *SecurityHandler) GetSessions(c *gin.Context) {
	c.JSON(http.StatusOK, models.SessionsResponse{Success: true, Data: []models.Session{}})
}

func (h *SecurityHandler) GetActivities(c *gin.Context) {
	c.JSON(http.StatusOK, models.ActivitiesResponse{Success: true, Data: []models.SecurityActivity{}})
}

func (h *SecurityHandler) TrustDevice(c *gin.Context) {
	deviceID := c.Param("id")
	if deviceID == "" {
		c.JSON(http.StatusBadRequest, models.DevicesResponse{Success: false, Error: "Device ID required"})
		return
	}
	c.JSON(http.StatusOK, models.DevicesResponse{Success: true})
}

func (h *SecurityHandler) RevokeDevice(c *gin.Context) {
	deviceID := c.Param("id")
	if deviceID == "" {
		c.JSON(http.StatusBadRequest, models.DevicesResponse{Success: false, Error: "Device ID required"})
		return
	}
	c.JSON(http.StatusOK, models.DevicesResponse{Success: true})
}

func (h *SecurityHandler) RevokeSession(c *gin.Context) {
	sessionID := c.Param("id")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, models.SessionsResponse{Success: false, Error: "Session ID required"})
		return
	}
	c.JSON(http.StatusOK, models.SessionsResponse{Success: true})
}

func (h *SecurityHandler) EnableTwoFactor(c *gin.Context) {
	var req models.EnableTwoFactorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.SecurityResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.SecurityResponse{Success: true, Data: &models.SecurityData{TwoFactor: models.TwoFactorConfig{Enabled: true, Method: req.Method}}})
}

func (h *SecurityHandler) DisableTwoFactor(c *gin.Context) {
	var req models.VerifyTwoFactorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.SecurityResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.SecurityResponse{Success: true, Data: &models.SecurityData{TwoFactor: models.TwoFactorConfig{Enabled: false}}})
}

func (h *SecurityHandler) VerifyTwoFactor(c *gin.Context) {
	var req models.VerifyTwoFactorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.SecurityResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.SecurityResponse{Success: true})
}

// ==================== THIRD PARTY HANDLERS ====================

type ThirdPartyHandler struct{}

func NewThirdPartyHandler() *ThirdPartyHandler { return &ThirdPartyHandler{} }

func (h *ThirdPartyHandler) ListApps(c *gin.Context) {
	c.JSON(http.StatusOK, models.ThirdPartyResponse{Success: true, Data: []models.ThirdPartyApp{}})
}

func (h *ThirdPartyHandler) ConnectApp(c *gin.Context) {
	var req models.ConnectAppRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ThirdPartyResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusCreated, models.ThirdPartyResponse{Success: true, Data: []models.ThirdPartyApp{{ID: "new-id", Name: req.AppName, AccessLevel: "Full"}}})
}

func (h *ThirdPartyHandler) RevokeApp(c *gin.Context) {
	appID := c.Param("id")
	if appID == "" {
		c.JSON(http.StatusBadRequest, models.ThirdPartyResponse{Success: false, Error: "App ID required"})
		return
	}
	c.JSON(http.StatusOK, models.ThirdPartyResponse{Success: true})
}

// ==================== CONTACT HANDLERS ====================

type ContactHandler struct{}

func NewContactHandler() *ContactHandler { return &ContactHandler{} }

type ContactsListResponse struct {
	Success bool                `json:"success"`
	Data    *models.ContactList `json:"data,omitempty"`
	Error   string              `json:"error,omitempty"`
}

func (h *ContactHandler) ListContacts(c *gin.Context) {
	contacts := &models.ContactList{
		AccountID:     "account-123",
		Contacts:      []*models.Contact{},
		TotalContacts: 0,
		HasMore:       false,
		Offset:        0,
		Limit:         50,
	}
	c.JSON(http.StatusOK, ContactsListResponse{Success: true, Data: contacts})
}

func (h *ContactHandler) GetContact(c *gin.Context) {
	contactID := c.Param("id")
	if contactID == "" {
		c.JSON(http.StatusBadRequest, models.ContactResponse{Success: false, Error: "Contact ID required"})
		return
	}
	c.JSON(http.StatusOK, models.ContactResponse{Success: true, Data: &models.Contact{ID: contactID}})
}

func (h *ContactHandler) CreateContact(c *gin.Context) {
	var req models.CreateContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ContactResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusCreated, models.ContactResponse{Success: true, Data: &models.Contact{ID: "new-id", Name: req.Name, Email: req.Email}})
}

func (h *ContactHandler) UpdateContact(c *gin.Context) {
	contactID := c.Param("id")
	var req models.UpdateContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ContactResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.ContactResponse{Success: true, Data: &models.Contact{ID: contactID}})
}

func (h *ContactHandler) DeleteContact(c *gin.Context) {
	contactID := c.Param("id")
	if contactID == "" {
		c.JSON(http.StatusBadRequest, models.ContactResponse{Success: false, Error: "Contact ID required"})
		return
	}
	c.JSON(http.StatusOK, models.ContactResponse{Success: true})
}

func (h *ContactHandler) ListGroups(c *gin.Context) {
	groups := &models.GroupList{
		AccountID: "account-123",
		Groups:    []*models.ContactGroup{},
		Total:     0,
	}
	c.JSON(http.StatusOK, models.GroupListResponse{Success: true, Data: groups})
}

func (h *ContactHandler) CreateGroup(c *gin.Context) {
	var req models.CreateGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.GroupResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusCreated, models.GroupResponse{Success: true, Data: &models.ContactGroup{ID: "new-id", Name: req.Name}})
}

// ==================== PRIVACY HANDLERS ====================

type PrivacyHandler struct{}

func NewPrivacyHandler() *PrivacyHandler { return &PrivacyHandler{} }

func (h *PrivacyHandler) GetPrivacySettings(c *gin.Context) {
	settings := models.AccountPrivacySettings{
		ProfileVisibility: "private",
		ShowEmail:         false,
		ShowPhone:         false,
		ShowActivity:      false,
		DataCollection:    false,
		PersonalizedAds:   false,
		Analytics:         false,
		LocationTracking:  false,
	}
	c.JSON(http.StatusOK, models.PrivacyResponse{Success: true, Data: &settings})
}

func (h *PrivacyHandler) UpdatePrivacySettings(c *gin.Context) {
	var req models.UpdatePrivacyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.PrivacyResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.PrivacyResponse{Success: true})
}

func (h *PrivacyHandler) ExportData(c *gin.Context) {
	var req models.DataExportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.DataExportResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.DataExportResponse{Success: true, Message: "Data export started"})
}

func (h *PrivacyHandler) DeleteAccount(c *gin.Context) {
	var req models.DeleteAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request"})
		return
	}
	if !req.Confirm {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Confirmation required"})
		return
	}
	c.JSON(http.StatusOK, models.AuthResponse{Success: true, Message: "Account deletion scheduled"})
}

// ==================== ETHERIA HANDLERS ====================

type EtheriaHandlers struct {
	jwtService *services.JWTService
}

func NewEtheriaHandlers(jwt *services.JWTService) *EtheriaHandlers {
	return &EtheriaHandlers{jwtService: jwt}
}

// Articles
func (h *EtheriaHandlers) ListArticles(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	status := c.Query("status")
	category := c.Query("category")
	search := c.Query("search")

	articles := []models.Article{
		{
			ID: "1", Title: "Les nouvelles réformes économiques", Slug: "reformes-economiques",
			Excerpt: "Le Premier ministre a dévoilé un plan ambitieux...", Content: "Contenu de l'article...",
			Status: models.ArticleStatusPublished, Featured: true, ViewCount: 15420, ReadTime: 5,
		},
	}

	if status != "" {
		filtered := []models.Article{}
		for _, a := range articles {
			if string(a.Status) == status {
				filtered = append(filtered, a)
			}
		}
		articles = filtered
	}

	if category != "" {
		filtered := []models.Article{}
		for _, a := range articles {
			if a.CategoryID == category {
				filtered = append(filtered, a)
			}
		}
		articles = filtered
	}

	if search != "" {
		filtered := []models.Article{}
		search = strings.ToLower(search)
		for _, a := range articles {
			if strings.Contains(strings.ToLower(a.Title), search) {
				filtered = append(filtered, a)
			}
		}
		articles = filtered
	}

	total := len(articles)
	totalPages := (total + pageSize - 1) / pageSize

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: articles, Total: total, Page: page, PageSize: pageSize, TotalPages: totalPages,
	})
}

func (h *EtheriaHandlers) GetArticle(c *gin.Context) {
	id := c.Param("id")
	article := models.Article{
		ID: id, Title: "Les nouvelles réformes économiques", Slug: "reformes-economiques",
		Excerpt: "Le Premier ministre a dévoilé un plan ambitieux...", Content: "Contenu complet...",
		Status: models.ArticleStatusPublished, ViewCount: 15421, ReadTime: 5,
	}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) GetArticleBySlug(c *gin.Context) {
	slug := c.Param("slug")
	article := models.Article{
		ID: "1", Title: "Les nouvelles réformes économiques", Slug: slug,
		Excerpt: "Le Premier ministre a dévoilé un plan ambitieux...", Content: "Contenu complet...",
		Status: models.ArticleStatusPublished, ViewCount: 15422, ReadTime: 5,
	}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) CreateArticle(c *gin.Context) {
	var req models.CreateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	article := models.Article{
		ID: "new-article-id", Title: req.Title, Slug: strings.ToLower(strings.ReplaceAll(req.Title, " ", "-")),
		Content: req.Content, Excerpt: req.Excerpt, Status: models.ArticleStatusDraft, AuthorID: c.GetString("userID"),
		CategoryID: req.CategoryID, ImageUrl: req.ImageUrl, SeoTitle: req.SeoTitle,
	}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) UpdateArticle(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	article := models.Article{ID: id, Title: req.Title, Slug: strings.ToLower(strings.ReplaceAll(req.Title, " ", "-"))}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) DeleteArticle(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Article supprimé: " + id})
}

func (h *EtheriaHandlers) PublishArticle(c *gin.Context) {
	id := c.Param("id")
	article := models.Article{ID: id, Status: models.ArticleStatusPublished, PublishedAt: time.Now()}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) ArchiveArticle(c *gin.Context) {
	id := c.Param("id")
	article := models.Article{ID: id, Status: models.ArticleStatusArchived}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) ToggleFeatured(c *gin.Context) {
	id := c.Param("id")
	article := models.Article{ID: id, Featured: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

// Categories
func (h *EtheriaHandlers) ListCategories(c *gin.Context) {
	categories := []models.Category{
		{ID: "1", Name: "Politique", Slug: "politique", IsVisible: true},
		{ID: "2", Name: "Économie", Slug: "economie", IsVisible: true},
		{ID: "3", Name: "International", Slug: "international", IsVisible: true},
	}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: categories})
}

func (h *EtheriaHandlers) GetCategory(c *gin.Context) {
	id := c.Param("id")
	category := models.Category{ID: id, Name: "Politique", Slug: "politique", Description: "Actualités politiques", IsVisible: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: category})
}

func (h *EtheriaHandlers) CreateCategory(c *gin.Context) {
	var req models.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	category := models.Category{
		ID: "new-category-id", Name: req.Name, Slug: strings.ToLower(strings.ReplaceAll(req.Name, " ", "-")),
		Description: req.Description, Color: req.Color, ParentID: req.ParentID, IsVisible: true,
	}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: category})
}

func (h *EtheriaHandlers) UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	category := models.Category{ID: id}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: category})
}

func (h *EtheriaHandlers) DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Catégorie supprimée: " + id})
}

// Comments
func (h *EtheriaHandlers) ListComments(c *gin.Context) {
	articleID := c.Param("articleId")
	comments := []models.Comment{
		{ID: "1", Content: "Excellent article, merci.", IsApproved: true, IsFlagged: false, ArticleID: articleID, AuthorID: "user-1"},
	}
	c.JSON(http.StatusOK, models.PaginatedResponse{Data: comments, Total: 1, Page: 1, PageSize: 20, TotalPages: 1})
}

func (h *EtheriaHandlers) CreateComment(c *gin.Context) {
	var req models.CreateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	comment := models.Comment{
		ID: "new-comment-id", Content: req.Content, IsApproved: true, ArticleID: c.Query("articleId"),
		AuthorID: c.GetString("userID"), ParentID: req.ParentID,
	}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: comment})
}

func (h *EtheriaHandlers) UpdateComment(c *gin.Context) {
	id := c.Param("id")
	comment := models.Comment{ID: id}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: comment})
}

func (h *EtheriaHandlers) DeleteComment(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Commentaire supprimé: " + id})
}

func (h *EtheriaHandlers) FlagComment(c *gin.Context) {
	id := c.Param("id")
	comment := models.Comment{ID: id, IsFlagged: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: comment})
}

func (h *EtheriaHandlers) ApproveComment(c *gin.Context) {
	id := c.Param("id")
	comment := models.Comment{ID: id, IsApproved: true, IsFlagged: false}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: comment})
}

// Bookmarks
func (h *EtheriaHandlers) ListBookmarks(c *gin.Context) {
	userID := c.GetString("userID")
	bookmarks := []models.Bookmark{{ID: "1", UserID: userID, ArticleID: "1"}}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: bookmarks})
}

func (h *EtheriaHandlers) AddBookmark(c *gin.Context) {
	var req struct{ ArticleID string }
	c.ShouldBindJSON(&req)
	bookmark := models.Bookmark{ID: "new-bookmark-id", UserID: c.GetString("userID"), ArticleID: req.ArticleID}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: bookmark})
}

func (h *EtheriaHandlers) RemoveBookmark(c *gin.Context) {
	articleID := c.Param("articleId")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Bookmark supprimé pour: " + articleID})
}

// Reading History
func (h *EtheriaHandlers) ListReadingHistory(c *gin.Context) {
	userID := c.GetString("userID")
	history := []models.ReadingHistory{{ID: "1", UserID: userID, ArticleID: "1"}}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: history})
}

func (h *EtheriaHandlers) AddToHistory(c *gin.Context) {
	var req struct{ ArticleID string }
	c.ShouldBindJSON(&req)
	history := models.ReadingHistory{ID: "new-history-id", UserID: c.GetString("userID"), ArticleID: req.ArticleID}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: history})
}

func (h *EtheriaHandlers) ClearHistory(c *gin.Context) {
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Historique effacé"})
}

func (h *EtheriaHandlers) RemoveFromHistory(c *gin.Context) {
	articleID := c.Param("articleId")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Historique supprimé pour: " + articleID})
}

// Notifications
func (h *EtheriaHandlers) ListNotifications(c *gin.Context) {
	userID := c.GetString("userID")
	notifications := []models.EtheriaNotification{
		{ID: "1", Type: models.NotificationTypeArticle, Title: "Nouvel article", Message: "Un nouvel article est disponible", IsRead: false, Priority: "medium", UserID: userID},
	}
	c.JSON(http.StatusOK, models.PaginatedResponse{Data: notifications, Total: 1, Page: 1, PageSize: 20, TotalPages: 1})
}

func (h *EtheriaHandlers) MarkNotificationRead(c *gin.Context) {
	id := c.Param("id")
	notification := models.EtheriaNotification{ID: id, IsRead: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: notification})
}

func (h *EtheriaHandlers) MarkAllNotificationsRead(c *gin.Context) {
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Toutes les notifications marquées comme lues"})
}

func (h *EtheriaHandlers) DeleteNotification(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Notification supprimée: " + id})
}

// Subscription
func (h *EtheriaHandlers) GetSubscription(c *gin.Context) {
	userID := c.GetString("userID")
	subscription := models.Subscription{
		ID: "1", UserID: userID, Plan: models.PlanPremium, Status: models.SubscriptionActive,
		NextPaymentDate: time.Now().AddDate(0, 1, 0), PaymentMethod: "card", PaymentLast4: "4242",
	}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: subscription})
}

func (h *EtheriaHandlers) CreateSubscription(c *gin.Context) {
	var req models.CreateSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	subscription := models.Subscription{ID: "new-subscription-id", UserID: c.GetString("userID"), Plan: models.SubscriptionPlan(req.Plan), Status: models.SubscriptionActive, NextPaymentDate: time.Now().AddDate(0, 1, 0)}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: subscription})
}

func (h *EtheriaHandlers) UpdateSubscription(c *gin.Context) {
	var req models.CreateSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	subscription := models.Subscription{Plan: models.SubscriptionPlan(req.Plan)}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: subscription})
}

func (h *EtheriaHandlers) CancelSubscription(c *gin.Context) {
	subscription := models.Subscription{CancelAtPeriodEnd: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: subscription})
}

// Media
func (h *EtheriaHandlers) ListMedia(c *gin.Context) {
	media := []models.Media{{ID: "1", Filename: "image.jpg", OriginalName: "image.jpg", MimeType: "image/jpeg", Size: 1024000, Url: "/uploads/image.jpg"}}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: media})
}

func (h *EtheriaHandlers) UploadMedia(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: "No file provided"})
		return
	}
	media := models.Media{ID: "new-media-id", Filename: file.Filename, OriginalName: file.Filename, MimeType: "image/jpeg", Size: 1024000, Url: "/uploads/" + file.Filename}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: media})
}

func (h *EtheriaHandlers) DeleteMedia(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Media supprimé: " + id})
}

// Settings
func (h *EtheriaHandlers) GetSettings(c *gin.Context) {
	settings := models.SystemSettings{
		ID: "1", SiteName: "The Etheria Times", SiteDescription: "L'information au service du citoyen",
		SiteUrl: "https://etheriatimes.com", Email: "contact@etheriatimes.com", SmtpHost: "smtp.etheriatimes.com",
		SmtpPort: 587, SmtpUser: "noreply@etheriatimes.com", FromName: "The Etheria Times", FromEmail: "noreply@etheriatimes.com",
		MaintenanceMode: false, RegistrationOpen: true, CommentsEnabled: true, NewsletterEnabled: true,
		AnalyticsEnabled: true, SslEnforced: true, DockerImage: "etheriatimes/etheriatimes:latest", Version: "1.0.0",
	}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: settings})
}

func (h *EtheriaHandlers) UpdateSettings(c *gin.Context) {
	var req models.EtheriaUpdateSettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	settings := models.SystemSettings{SiteName: req.SiteName}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: settings})
}

func (h *EtheriaHandlers) TestEmailConfig(c *gin.Context) {
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Email de test envoyé"})
}

// Admin Users
func (h *EtheriaHandlers) ListUsers(c *gin.Context) {
	users := []models.EtheriaUser{{ID: "1", Email: "admin@etheriatimes.com", FirstName: "Admin", LastName: "User", Role: models.RoleAdmin, IsActive: true}}
	c.JSON(http.StatusOK, models.PaginatedResponse{Data: users, Total: 1, Page: 1, PageSize: 10, TotalPages: 1})
}

func (h *EtheriaHandlers) GetUser(c *gin.Context) {
	id := c.Param("id")
	user := models.EtheriaUser{ID: id, Email: "user@example.com", FirstName: "John", LastName: "Doe", Role: models.RoleUser, IsActive: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: user})
}

func (h *EtheriaHandlers) UpdateUser(c *gin.Context) {
	id := c.Param("id")
	user := models.EtheriaUser{ID: id}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: user})
}

func (h *EtheriaHandlers) DeleteUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Utilisateur supprimé: " + id})
}
