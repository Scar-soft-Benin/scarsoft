<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de votre mot de passe</title>
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
            color: #dc2626;
            margin-bottom: 10px;
        }
        .code-container {
            background-color: #fef2f2;
            border: 2px dashed #fecaca;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .verification-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #dc2626;
            font-family: 'Courier New', monospace;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #6b7280;
            font-size: 14px;
        }
        .security-warning {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .expiry-info {
            background-color: #f0f9ff;
            border-left: 4px solid #3b82f6;
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
            <h1>Réinitialisation de mot de passe</h1>
        </div>

        <p>Bonjour {{ $user_name }},</p>
        
        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Pour procéder à la réinitialisation, veuillez utiliser le code de sécurité ci-dessous :</p>

        <div class="code-container">
            <div class="verification-code">{{ $code }}</div>
            <p style="margin: 10px 0 0 0; color: #6b7280;">Code de réinitialisation</p>
        </div>

        <div class="expiry-info">
            <strong>Délai d'expiration :</strong> Ce code expirera le <strong>{{ $expires_at->format('d/m/Y à H:i') }}</strong>. Vous disposez donc de {{ $expires_at->diffInMinutes(now()) }} minutes pour l'utiliser.
        </div>

        <div class="security-warning">
            <strong>Important :</strong> Si vous n'avez pas demandé cette réinitialisation, votre compte pourrait être compromis. Dans ce cas, contactez immédiatement notre équipe de sécurité et changez votre mot de passe dès que possible.
        </div>

        <p>Pour des raisons de sécurité, nous vous recommandons de choisir un mot de passe fort comprenant au moins 8 caractères avec une combinaison de lettres majuscules, minuscules, chiffres et caractères spéciaux.</p>

        <p>Si vous rencontrez des difficultés lors de la réinitialisation, notre équipe de support technique est disponible pour vous assister.</p>

        <p>Cordialement,<br>L'équipe sécurité de {{ config('app.name') }}</p>

        <div class="footer">
            <p>Pour votre sécurité, ne partagez jamais ce code avec personne.</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            <p>© {{ date('Y') }} {{ config('app.name') }}. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>