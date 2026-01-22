import pandas as pd
import random
import os

# Constants
ATTACK_TYPES = ['Phishing', 'Malware', 'DDoS', 'Ransomware', 'SQL Injection']
SEVERITIES = ['Low', 'Medium', 'High', 'Critical']
SOURCES = ['Email', 'Firewall', 'IDS', 'SIEM', 'User Report']

# Templates for generating realistic threat text
TEMPLATES = [
    "Detected suspicious {attack} activity originating from IP {ip}. Target system: {target}.",
    "User reported {attack} attempt via {source}. Subject: 'Urgent Action Required'.",
    "Firewall blocked potential {attack} packet flood on port {port}.",
    "High severity {attack} signature matched in network traffic. Source: {source}.",
    "System scan revealed {attack} payload in file '{file}'.",
    "Anomalous traffic pattern suggestive of {attack} detected by {source}.",
    "Multiple failed login attempts followed by {attack} execution command.",
    "Encrypted traffic analysis indicates possible {attack} communication.",
    "Compromised credential usage linked to known {attack} campaign.",
    "{attack} alert triggered by heuristic analysis engine."
]

def generate_threat_text(attack_type, source):
    ip = f"{random.randint(1,255)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(0,255)}"
    port = random.randint(1024, 65535)
    target = f"Server-{random.randint(100,999)}"
    file = f"update_{random.randint(1000,9999)}.exe"
    
    template = random.choice(TEMPLATES)
    return template.format(attack=attack_type, ip=ip, port=port, target=target, file=file, source=source)

def generate_dataset():
    data = []
    
    # Ensure some balance, but add randomness
    for i in range(500):
        attack_type = random.choice(ATTACK_TYPES)
        severity = random.choice(SEVERITIES)
        source = random.choice(SOURCES)
        
        # Correlate severity slightly with attack type for realism
        if attack_type in ['Ransomware', 'DDoS'] and random.random() > 0.3:
            severity = 'Critical'
        if attack_type == 'Phishing' and random.random() > 0.7:
            severity = 'Medium'
            
        threat_text = generate_threat_text(attack_type, source)
        
        row = {
            'report_id': f"RPT-{10000+i}",
            'threat_text': threat_text,
            'attack_type': attack_type,
            'severity': severity,
            'source': source
        }
        data.append(row)
    
    df = pd.DataFrame(data)
    
    # Ensure uniqueness
    df.drop_duplicates(subset=['threat_text'], inplace=True)
    
    # Fill up if dropped
    while len(df) < 500:
        attack_type = random.choice(ATTACK_TYPES)
        row = {
            'report_id': f"RPT-{10000+len(df)}",
            'threat_text': generate_threat_text(attack_type, random.choice(SOURCES)) + f" ({random.randint(1,100)})", # Add noise to ensure uniqueness
            'attack_type': attack_type,
            'severity': random.choice(SEVERITIES),
            'source': random.choice(SOURCES)
        }
        df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
        
    df = df.head(500) # strict 500
    
    output_path = os.path.join("data", "cyber_threat_dataset.xlsx")
    os.makedirs("data", exist_ok=True)
    df.to_excel(output_path, index=False)
    print(f"Dataset generated successfully at {output_path} with {len(df)} rows.")

if __name__ == "__main__":
    generate_dataset()
