# Todo App Cloud - Promotion 2026

Application Todo List moderne construite avec **React Router v7** (full-stack) et deployee sur **Microsoft Azure**. Ce projet illustre une architecture Cloud securisee, scalable et automatisee.

## Stack technique

| Couche | Technologie |
| --- | --- |
| Frontend | React 19 + React Router v7 (SSR) |
| Backend | React Router loaders/actions (serveur Node.js) |
| Base de donnees | Azure Cosmos DB (API NoSQL) |
| Hebergement | Azure App Service |
| Secrets | Azure Key Vault + Managed Identity |
| Stockage fichiers | Azure Blob Storage |

## Architecture Cloud

```text
Browser
  │
  ▼
Azure App Service  (frontend + API sur le même process Node)
  │
  ├─► Azure Cosmos DB   (persistance des todos)
  └─► Azure Key Vault   (lecture des secrets via MSI)
```

### Sécurité & RBAC

L'App Service possède une **Identité Managée (MSI)** autorisée à lire les secrets du Key Vault. Aucune clé n'est stockée en dur dans le code.

### Multi-environnement (Deployment Slots)

Un slot **Staging** permet de valider chaque déploiement avant un **Swap** sans interruption de service (Zero Downtime Deployment).

### Scalabilité

Infrastructure configurée pour le **scaling manuel** (Scale-out) afin d'absorber les pics de trafic.

### Gestion du cycle de vie (Blob Storage)

Azure Blob Storage est configuré avec des **politiques de cycle de vie** qui suppriment automatiquement les fichiers temporaires après 7 jours.

---

## API REST

Base URL : `/api`

Le modèle `Todo` retourné par tous les endpoints :

```json
{
  "id": "uuid-v4",
  "title": "string",
  "done": false,
  "createdAt": "2026-04-10T12:00:00.000Z"
}
```

### `GET /api/todos`

Retourne la liste de tous les todos, triés par date de création (ASC).

**Réponse `200`**

```json
[
  { "id": "...", "title": "Acheter du lait", "done": false, "createdAt": "..." },
  { "id": "...", "title": "Lire un livre",   "done": true,  "createdAt": "..." }
]
```

---

### `POST /api/todos`

Crée un nouveau todo.

**Body**

```json
{ "title": "Ma nouvelle tâche" }
```

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `title` | string | oui | Titre de la tache (non vide) |

**Réponses**

| Code | Description |
| --- | --- |
| `201` | Todo cree — retourne l'objet `Todo` |
| `400` | JSON invalide |
| `422` | `title` manquant ou vide |

---

### `GET /api/todos/:id`

Retourne un todo par son identifiant.

**Réponses**

| Code | Description |
| --- | --- |
| `200` | Objet `Todo` |
| `404` | Todo introuvable |

---

### `PATCH /api/todos/:id`

Met à jour le titre et/ou l'état d'un todo. Tous les champs sont optionnels.

**Body**

```json
{ "title": "Nouveau titre", "done": true }
```

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `title` | string | non | Nouveau titre (non vide) |
| `done` | boolean | non | Etat de completion |

**Réponses**

| Code | Description |
| --- | --- |
| `200` | Objet `Todo` mis a jour |
| `400` | JSON invalide |
| `404` | Todo introuvable |
| `422` | Valeur invalide pour `title` ou `done` |

---

### `DELETE /api/todos/:id`

Supprime un todo.

**Réponses**

| Code | Description |
| --- | --- |
| `204` | Suppression reussie (pas de corps) |
| `404` | Todo introuvable |

---

## Variables d'environnement

| Variable | Requis | Defaut | Description |
| --- | --- | --- | --- |
| `COSMOS_ENDPOINT` | oui | — | URL du compte Cosmos DB |
| `COSMOS_KEY` | oui | — | Cle primaire Cosmos DB |
| `COSMOS_DATABASE` | non | `TodoDatabase` | Nom de la base de donnees |
| `COSMOS_CONTAINER` | non | `Items` | Nom du conteneur |

En production, `COSMOS_ENDPOINT` et `COSMOS_KEY` sont lus depuis **Azure Key Vault** via la Managed Identity. En développement local, créez un fichier `.env` à la racine :

```env
COSMOS_ENDPOINT=https://<votre-compte>.documents.azure.com:443/
COSMOS_KEY=<votre-cle>
```

---

## Installation & développement local

```bash
# 1. Cloner le dépôt
git clone https://github.com/allanthieryd/todo-app-cloud.git
cd todo-app-cloud

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env   # puis éditer .env

# 4. Lancer en mode développement
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

---

## Liens

| Environnement | URL |
| --- | --- |
| Production | [todo-app-allan-2026.azurewebsites.net](https://todo-app-allan-2026.azurewebsites.net/) |
| Staging | [todo-app-allan-2026-staging.azurewebsites.net](https://todo-app-allan-2026-staging.azurewebsites.net/) |
| Document PDF (Blob public) | [Projet evaluation Cloud Azure](https://statodoallan2026.blob.core.windows.net/archives/Projet_d%E2%80%99%C3%A9valuation_pratique_Cloud_Azure.pdf) |
