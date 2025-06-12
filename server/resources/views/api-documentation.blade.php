<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API d'Authentification JWT - Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8fafc;
            color: #2d3748;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }

        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
        }

        .content {
            padding: 30px;
        }

        .endpoint {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            margin: 20px 0;
            overflow: hidden;
        }

        .endpoint-header {
            padding: 15px 20px;
            background: #edf2f7;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .method {
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.9em;
            text-transform: uppercase;
        }

        .method.get {
            background: #48bb78;
            color: white;
        }

        .method.post {
            background: #4299e1;
            color: white;
        }

        .method.put {
            background: #ed8936;
            color: white;
        }

        .method.delete {
            background: #f56565;
            color: white;
        }

        .endpoint-url {
            font-family: 'Monaco', 'Menlo', monospace;
            background: #2d3748;
            color: #68d391;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }

        .endpoint-body {
            padding: 20px;
        }

        .endpoint-description {
            margin-bottom: 15px;
            color: #4a5568;
        }

        .code-block {
            background: #1a202c;
            color: #a0aec0;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
            margin: 10px 0;
        }

        .json {
            color: #68d391;
        }

        .string {
            color: #fbb6ce;
        }

        .number {
            color: #90cdf4;
        }

        .base-info {
            background: #ebf8ff;
            border: 1px solid #90cdf4;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }

        .auth-note {
            background: #fef5e7;
            border: 1px solid #f6ad55;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }

        .success {
            color: #38a169;
        }

        .warning {
            color: #d69e2e;
        }

        .error {
            color: #e53e3e;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>API d'Authentification JWT</h1>
            <p>Documentation complète de l'API d'authentification personnalisée</p>
        </div>

        <div class="content">
            <div class="base-info">
                <h3>🚀 Informations de base</h3>
                <p><strong>URL de base :</strong> <code>http://localhost:8000</code></p>
                <p><strong>Version :</strong> 1.0.0</p>
                <p><strong>Type d'authentification :</strong> JWT Bearer Token</p>
                <p><strong>Format des réponses :</strong> JSON</p>
            </div>

            <!-- Test API -->
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="endpoint-url">/api/test</span>
                    <span>Test de l'API</span>
                </div>
                <div class="endpoint-body">
                    <div class="endpoint-description">Vérifier que l'API fonctionne correctement</div>
                    <div class="code-block">
                        <span class="json">{</span>
                        <span class="string">"success"</span>: <span class="json">true</span>,
                        <span class="string">"message"</span>: <span class="string">"API fonctionne
                            correctement"</span>,
                        <span class="string">"timestamp"</span>: <span
                            class="string">"2024-01-15T15:30:00.000000Z"</span>
                        <span class="json">}</span>
                    </div>
                </div>
            </div>

            <!-- Inscription -->
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="endpoint-url">/api/auth/register</span>
                    <span>Inscription utilisateur</span>
                </div>
                <div class="endpoint-body">
                    <div class="endpoint-description">Créer un nouveau compte utilisateur</div>
                    <strong>Corps de la requête :</strong>
                    <div class="code-block">
                        <span class="json">{</span>
                        <span class="string">"name"</span>: <span class="string">"John Doe"</span>,
                        <span class="string">"email"</span>: <span class="string">"john.doe@example.com"</span>,
                        <span class="string">"password"</span>: <span class="string">"Password123!"</span>,
                        <span class="string">"password_confirmation"</span>: <span class="string">"Password123!"</span>
                        <span class="json">}</span>
                    </div>
                    <strong>Réponse de succès (201) :</strong>
                    <div class="code-block">
                        <span class="json">{</span>
                        <span class="string">"success"</span>: <span class="json">true</span>,
                        <span class="string">"message"</span>: <span class="string">"Utilisateur créé avec
                            succès"</span>,
                        <span class="string">"user"</span>: <span class="json">{</span>
                        <span class="string">"id"</span>: <span class="number">1</span>,
                        <span class="string">"name"</span>: <span class="string">"John Doe"</span>,
                        <span class="string">"email"</span>: <span class="string">"john.doe@example.com"</span>
                        <span class="json">}</span>
                        <span class="json">}</span>
                    </div>
                </div>
            </div>

            <!-- Connexion -->
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="endpoint-url">/api/auth/login</span>
                    <span>Connexion utilisateur</span>
                </div>
                <div class="endpoint-body">
                    <div class="endpoint-description">Authentifier un utilisateur et obtenir un token JWT</div>
                    <strong>Corps de la requête :</strong>
                    <div class="code-block">
                        <span class="json">{</span>
                        <span class="string">"email"</span>: <span class="string">"john.doe@example.com"</span>,
                        <span class="string">"password"</span>: <span class="string">"Password123!"</span>
                        <span class="json">}</span>
                    </div>
                    <strong>Réponse de succès (200) :</strong>
                    <div class="code-block">
                        <span class="json">{</span>
                        <span class="string">"success"</span>: <span class="json">true</span>,
                        <span class="string">"access_token"</span>: <span
                            class="string">"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."</span>,
                        <span class="string">"token_type"</span>: <span class="string">"Bearer"</span>,
                        <span class="string">"user"</span>: <span class="json">{...}</span>
                        <span class="json">}</span>
                    </div>
                </div>
            </div>

            <!-- Profil utilisateur -->
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="endpoint-url">/api/auth/me</span>
                    <span>Profil utilisateur (🔒 Protégé)</span>
                </div>
                <div class="endpoint-body">
                    <div class="endpoint-description">Obtenir les informations de l'utilisateur connecté</div>
                    <div class="auth-note">
                        <strong>⚠️ Authentification requise :</strong> Inclure l'en-tête
                        <code>Authorization: Bearer {token}</code>
                    </div>
                    <strong>En-têtes requis :</strong>
                    <div class="code-block">
                        Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
                    </div>
                </div>
            </div>

            <!-- Vérification email -->
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="endpoint-url">/api/auth/email/verify</span>
                    <span>Vérification email avec code OTP</span>
                </div>
                <div class="endpoint-body">
                    <div class="endpoint-description">Vérifier l'adresse email avec un code OTP à 6 chiffres</div>
                    <strong>Corps de la requête :</strong>
                    <div class="code-block">
                        <span class="json">{</span>
                        <span class="string">"email"</span>: <span class="string">"john.doe@example.com"</span>,
                        <span class="string">"code"</span>: <span class="string">"123456"</span>
                        <span class="json">}</span>
                    </div>
                    <div class="auth-note">
                        <strong>📧 Récupération du code :</strong> Vérifiez les logs Laravel avec
                        <code>docker exec -it scarsoft-php tail -f storage/logs/laravel.log</code>
                    </div>
                </div>
            </div>

            <!-- Réinitialisation mot de passe -->
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="endpoint-url">/api/auth/password/forgot</span>
                    <span>Demande de réinitialisation</span>
                </div>
                <div class="endpoint-body">
                    <div class="endpoint-description">Demander un code de réinitialisation de mot de passe</div>
                    <strong>Corps de la requête :</strong>
                    <div class="code-block">
                        <span class="json">{</span>
                        <span class="string">"email"</span>: <span class="string">"john.doe@example.com"</span>
                        <span class="json">}</span>
                    </div>
                </div>
            </div>

            <div class="base-info">
                <h3>🔧 Codes d'erreur courants</h3>
                <ul>
                    <li><strong>400</strong> - Requête malformée ou validation échouée</li>
                    <li><strong>401</strong> - Non authentifié (token manquant/invalide)</li>
                    <li><strong>403</strong> - Accès interdit (compte désactivé)</li>
                    <li><strong>404</strong> - Ressource non trouvée</li>
                    <li><strong>422</strong> - Erreurs de validation</li>
                    <li><strong>429</strong> - Trop de requêtes (limitation de taux)</li>
                    <li><strong>500</strong> - Erreur serveur interne</li>
                </ul>
            </div>

            <div class="base-info">
                <h3>🧪 Test avec cURL</h3>
                <div class="code-block">
                    # Test de l'API
                    curl http://localhost:8000/api/test

                    # Inscription
                    curl -X POST http://localhost:8000/api/auth/register
                    -H "Content-Type: application/json"
                    -d '{"name":"Test
                    User","email":"test@example.com","password":"Password123!","password_confirmation":"Password123!"}'

                    # Connexion
                    curl -X POST http://localhost:8000/api/auth/login
                    -H "Content-Type: application/json"
                    -d '{"email":"test@example.com","password":"Password123!"}'
                </div>
            </div>
        </div>
    </div>
</body>

</html>