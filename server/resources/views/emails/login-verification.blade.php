<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de connexion</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .code-container {
            background-color: #f8fafc;
            border: 2px dashed #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .verification-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #2563eb;
            font-family: 'Courier New', monospace;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #6b7280;
            font-size: 14px;
        }
        .security-note {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{{ config('app.name') }}</div>
            <h1>Code de connexion</h1>
        </div>

        <p>Bonjour {{ $user_name }},</p>
        
        <p>Nous avons détecté une tentative de connexion sur votre compte. Pour finaliser votre connexion, veuillez utiliser le code de vérification ci-dessous :</p>

        <div class="code-container">
            <div class="verification-code">{{ $code }}</div>
            <p style="margin: 10px 0 0 0; color: #6b7280;">Code de connexion</p>
        </div>

        <p>Ce code expirera le <strong>{{ $expires_at->format('d/m/Y à H:i') }}</strong>.</p>

        <div class="security-note">
            <strong>Note de sécurité :</strong> Si vous n'êtes pas à l'origine de cette connexion, veuillez ignorer cet email et changer votre mot de passe. Ne partagez jamais ce code avec personne.
        </div>

        <p>Si vous rencontrez des difficultés, n'hésitez pas à contacter notre équipe de support.</p>

        <p>Cordialement,<br>L'équipe {{ config('app.name') }}</p>

        <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            <p>© {{ date('Y') }} {{ config('app.name') }}. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>