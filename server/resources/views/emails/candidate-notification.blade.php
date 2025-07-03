{{-- resources/views/emails/candidate-notification.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mise à jour de votre candidature</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #10b981;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e0e0e0;
        }
        .job-info {
            background-color: white;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 14px;
        }
        .message-box {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>ScarSoft</h1>
        <p>Mise à jour de votre candidature</p>
    </div>

    <div class="content">
        <p>Bonjour,</p>

        <div class="job-info">
            <h3>{{ $job_title }}</h3>
            <p><strong>Entreprise :</strong> {{ $company_name }}</p>
        </div>

        <div class="message-box">
            <h4>Message de nos équipes :</h4>
            <p>{{ $message }}</p>
        </div>

        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>

        <p>Cordialement,<br>
        <strong>{{ $admin_name }}</strong><br>
        Équipe ScarSoft</p>
    </div>

    <div class="footer">
        <p>ScarSoft - Votre partenaire emploi et technologie</p>
        <p>📧 contact@scar-soft.com | 📱 +229 68 505 786</p>
        <p>🌐 <a href="https://scar-soft.com">www.scar-soft.com</a></p>
        <p><small>Email envoyé le {{ $sent_at->format('d/m/Y à H:i') }}</small></p>
    </div>
</body>
</html>