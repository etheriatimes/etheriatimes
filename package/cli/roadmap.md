# Etheria Times CLI - Roadmap

## Commandes existantes

### `article`

- `article create` - Créer un nouvel article
- `article preview <file>` - Prévisualiser un fichier markdown

### `config`

- `config set <key> <value>` - Définir une valeur de configuration
- `config get <key>` - Obtenir une valeur de configuration

---

## Nouvelles commandes à implémenter

### `analytics`

```bash
etheriatimes analytics
etheriatimes analytics list                    # Liste les analytics
etheriatimes analytics view <metric>           # Voir une métrique spécifique
etheriatimes analytics export <format>         # Exporter les données (csv/json)
```

### `api-keys`

```bash
etheriatimes api-keys
etheriatimes api-keys list                     # Liste les clés API
etheriatimes api-keys create <name>            # Créer une nouvelle clé API
etheriatimes api-keys revoke <id>              # Révoquer une clé API
etheriatimes api-keys view <id>                 # Voir les détails d'une clé
```

### `advertising`

```bash
etheriatimes advertising
etheriatimes advertising campaigns             # Liste les campagnes
etheriatimes advertising create <name>          # Créer une campagne
etheriatimes advertising stats                 # Statistiques publicitaires
```

### `audit-logs`

```bash
etheriatimes audit-logs
etheriatimes audit-logs list                   # Liste les logs d'audit
etheriatimes audit-logs filter <criteria>     # Filtrer les logs
etheriatimes audit-logs export                 # Exporter les logs
```

### `categories`

```bash
etheriatimes categories
etheriatimes categories list                   # Liste les catégories
etheriatimes categories create <name>          # Créer une catégorie
etheriatimes categories update <id> <name>    # Modifier une catégorie
etheriatimes categories delete <id>            # Supprimer une catégorie
```

### `comments`

```bash
etheriatimes comments
etheriatimes comments list                     # Liste les commentaires
etheriatimes comments list --article <id>     # Commentaires d'un article
etheriatimes comments approve <id>             # Approuver un commentaire
etheriatimes comments reject <id>              # Rejeter un commentaire
etheriatimes comments delete <id>              # Supprimer un commentaire
```

### `dossiers`

```bash
etheriatimes dossiers
etheriatimes dossiers list                     # Liste les dossiers
etheriatimes dossiers create <name>            # Créer un dossier
etheriatimes dossiers view <name>               # Voir un dossier
etheriatimes dossiers add-article <dossier> <article>  # Ajouter un article au dossier
```

### `linker`

```bash
etheriatimes linker
etheriatimes linker list                       # Liste les liens shortening
etheriatimes linker create <url>               # Créer un lien court
etheriatimes linker stats <shortcode>          # Statistiques d'un lien
```

### `logs`

```bash
etheriatimes logs
etheriatimes logs list                        # Liste les logs
etheriatimes logs filter <level>              # Filtrer par niveau
etheriatimes logs export                      # Exporter les logs
```

### `medias`

```bash
etheriatimes medias
etheriatimes medias list                      # Liste les médias
etheriatimes medias upload <file>              # Uploader un média
etheriatimes medias delete <id>                # Supprimer un média
etheriatimes medias view <id>                  # Voir les détails d'un média
```

### `newsletter`

```bash
etheriatimes newsletter
etheriatimes newsletter list                  # Liste les newsletters
etheriatimes newsletter send <id>             # Envoyer une newsletter
etheriatimes newsletter create <name>         # Créer une newsletter
etheriatimes newsletter stats <id>            # Statistiques d'une newsletter
```

### `notifications`

```bash
etheriatimes notifications
etheriatimes notifications list              # Liste les notifications
etheriatimes notifications read <id>          # Marquer comme lu
etheriatimes notifications read-all           # Marquer tout comme lu
etheriatimes notifications delete <id>        # Supprimer une notification
```

### `publications`

```bash
etheriatimes publications
etheriatimes publications list                # Liste les publications
etheriatimes publications schedule <article>  # Planifier une publication
etheriatimes publications publish <article>   # Publier immédiatement
etheriatimes publications cancel <id>         # Annuler une publication
```

### `scheduling`

```bash
etheriatimes scheduling
etheriatimes scheduling list                  # Liste les publications planifiées
etheriatimes scheduling add <article> <date>  # Planifier une publication
etheriatimes scheduling remove <id>           # Supprimer une planification
etheriatimes scheduling update <id> <date>    # Modifier une planification
```

### `seo`

```bash
etheriatimes seo
etheriatimes seo analyze <article>            # Analyser le SEO d'un article
etheriatimes seo score <article>              # Score SEO
etheriatimes seo suggestions <article>        # Suggestions d'amélioration
```

### `settings`

```bash
etheriatimes settings
etheriatimes settings view                    # Voir les paramètres
etheriatimes settings update <key> <value>    # Mettre à jour un paramètre
etheriatimes settings reset                   # Réinitialiser aux valeurs par défaut
```

### `social`

```bash
etheriatimes social
etheriatimes social post <platform> <content>  # Poster sur une plateforme
etheriatimes social schedule <platform> <content> <date>  # Planifier un post
etheriatimes social accounts                  # Liste des comptes connectés
etheriatimes social connect <platform>        # Connecter un compte
etheriatimes social disconnect <platform>    # Déconnecter un compte
```

### `social-accounts`

```bash
etheriatimes social-accounts
etheriatimes social-accounts list             # Liste les comptes sociaux
etheriatimes social-accounts add <platform>  # Ajouter un compte
etheriatimes social-accounts remove <id>     # Supprimer un compte
```

### `social-analytics`

```bash
etheriatimes social-analytics
etheriatimes social-analytics dashboard       # Tableau de bord analytics
etheriatimes social-analytics platform <p>   # Analytics par plateforme
etheriatimes social-analytics export         # Exporter les données
```

### `subscriptions`

```bash
etheriatimes subscriptions
etheriatimes subscriptions list               # Liste les abonnements
etheriatimes subscriptions add <email>        # Ajouter un abonné
etheriatimes subscriptions remove <email>     # Supprimer un abonné
etheriatimes subscriptions export             # Exporter la liste
```

### `users`

```bash
etheriatimes users
etheriatimes users list                       # Liste les utilisateurs
etheriatimes users create <email> <role>     # Créer un utilisateur
etheriatimes users update <id> <role>        # Modifier le rôle d'un utilisateur
etheriatimes users delete <id>                # Supprimer un utilisateur
etheriatimes users view <id>                  # Voir les détails d'un utilisateur
```

---

## Structure recommandée

```
package/cli/src/commands/
├── index.ts           # Export de toutes les commandes
├── article.ts         # Déjà existant
├── config.ts          # Déjà existant
├── analytics.ts       # À créer
├── api-keys.ts        # À créer
├── advertising.ts     # À créer
├── audit-logs.ts     # À créer
├── categories.ts      # À créer
├── comments.ts       # À créer
├── dossiers.ts       # À créer
├── linker.ts         # À créer
├── logs.ts           # À créer
├── medias.ts         # À créer
├── newsletter.ts     # À créer
├── notifications.ts  # À créer
├── publications.ts   # À créer
├── scheduling.ts     # À créer
├── seo.ts            # À créer
├── settings.ts       # À créer
├── social.ts         # À créer
├── social-accounts.ts    # À créer
├── social-analytics.ts  # À créer
├── subscriptions.ts    # À créer
└── users.ts          # À créer
```
