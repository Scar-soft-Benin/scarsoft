<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nouvelle candidature</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1e3a8a;
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
        .candidate-info {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
        }
        .job-info {
            background-color: #e0f2fe;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .message-box {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e0e0e0;
        }
        .attachments {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #ffeaa7;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 14px;
        }
        .contact-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .contact-item {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>ScarSoft</h1>
        <p>Nouvelle candidature sélectionnée</p>
    </div>

    <div class="content">
        <p>Bonjour {{ $company_name }},</p>

        <div class="job-info">
            <h3>📋 Offre concernée</h3>
            <p><strong>{{ $job_title }}</strong></p>
        </div>

        <div class="message-box">
            <h4>💬 Message de notre équipe :</h4>
            <p>{{ $message }}</p>
        </div>

        <div class="candidate-info">
            <h3>👤 Informations du candidat</h3>
            
            <div class="contact-info">
                <div class="contact-item">
                    <strong>Nom :</strong><br>
                    {{ $candidate['name'] }}
                </div>
                <div class="contact-item">
                    <strong>Email :</strong><br>
                    <a href="mailto:{{ $candidate['email'] }}">{{ $candidate['email'] }}</a>
                </div>
                <div class="contact-item">
                    <strong>Téléphone :</strong><br>
                    <a href="tel:{{ $candidate['phone'] }}">{{ $candidate['phone'] }}</a>
                </div>
                <div class="contact-item">
                    <strong>Lettre de motivation :</strong><br>
                    {{ $candidate['cover_letter_display'] }}
                </div>
            </div>

            @if($candidate['cover_letter_content'])
            <div style="margin-top: 15px; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                <h4>📄 Lettre de motivation :</h4>
                <p style="font-style: italic; white-space: pre-line;">{{ $candidate['cover_letter_content'] }}</p>
            </div>
            @endif
        </div>

        <div class="attachments">
            <h4>📎 Documents joints</h4>
            <p>Les documents du candidat (CV et lettre de motivation) sont joints à cet email.</p>
            <ul>
                <li>✅ CV du candidat</li>
                @if($candidate['cover_letter_content'])
                <li>✅ Lettre de motivation (dans le message)</li>
                @else
                <li>✅ Lettre de motivation (fichier joint)</li>
                @endif
            </ul>
        </div>

        <p><strong>Prochaines étapes :</strong></p>
        <ul>
            <li>Examinez les documents joints</li>
            <li>Contactez directement le candidat si vous souhaitez poursuivre</li>
            <li>Informez-nous de votre décision pour notre suivi</li>
        </ul>

        <p>Nous restons à votre disposition pour toute question concernant cette candidature.</p>

        <p>Cordialement,<br>
        <strong>{{ $admin_name }}</strong><br>
        Équipe ScarSoft</p>
    </div>

    <div class="footer">
        <p><strong>ScarSoft</strong> - Votre partenaire recrutement et technologie</p>
        <p>📧 contact@scar-soft.com | 📱 +229 68 505 786</p>
        <p>🌐 <a href="https://scar-soft.com">www.scar-soft.com</a></p>
        <p><small>Email envoyé le {{ $sent_at->format('d/m/Y à H:i') }}</small></p>
    </div>
</body>
</html>