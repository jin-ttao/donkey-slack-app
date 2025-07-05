# n8n을 npm으로 호스팅하는 방법

## 개요

n8n은 Node.js 기반의 오픈소스 워크플로우 자동화 도구입니다. npm을 통해 설치하고 자체 서버에서 호스팅할 수 있어 완전한 데이터 제어와 커스터마이징이 가능합니다.

## 사전 요구사항

### 하드웨어 요구사항
- **CPU**: 최소 2코어 (4코어 권장)
- **메모리**: 최소 2GB RAM (4GB 권장)
- **스토리지**: 최소 20GB SSD
- **네트워크**: 안정적인 인터넷 연결

### 소프트웨어 요구사항
- **운영체제**: Linux (Ubuntu 20.04+), macOS, Windows
- **Node.js**: 16.x 또는 18.x LTS 버전
- **npm**: Node.js와 함께 설치됨
- **Git**: 업데이트 및 관리용
- **데이터베이스**: PostgreSQL (권장), MySQL, SQLite

## 설치 과정

### 1. Node.js 설치

#### Ubuntu/Debian
```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js 설치
sudo apt-get install -y nodejs
```

#### macOS
```bash
# Homebrew 사용
brew install node
```

#### 설치 확인
```bash
node --version
npm --version
```

### 2. n8n 전역 설치

```bash
# 전역 설치
npm install n8n -g

# 설치 확인
n8n --version
```

### 3. 환경 설정

#### 환경 변수 파일 생성
```bash
# n8n 설정 디렉토리 생성
mkdir -p ~/.n8n

# 환경 변수 파일 생성
nano ~/.n8n/.env
```

#### 기본 환경 변수 설정
```env
# 서버 설정
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=http

# 기본 인증 설정
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password

# 웹훅 URL 설정
N8N_WEBHOOK_URL=http://your-domain.com:5678/

# 암호화 키 설정
N8N_ENCRYPTION_KEY=your_secret_encryption_key

# 타임존 설정
GENERIC_TIMEZONE=Asia/Seoul
```

### 4. 데이터베이스 설정 (PostgreSQL 권장)

#### PostgreSQL 설치
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
```

#### 데이터베이스 생성
```bash
# PostgreSQL 접속
sudo -u postgres psql

# 데이터베이스 및 사용자 생성
CREATE DATABASE n8n;
CREATE USER n8nuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE n8n TO n8nuser;
\q
```

#### 데이터베이스 환경 변수 추가
```env
# PostgreSQL 설정
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8nuser
DB_POSTGRESDB_PASSWORD=your_password
```

### 5. n8n 실행

#### 환경 변수 로드 및 실행
```bash
# 환경 변수 로드
export $(cat ~/.n8n/.env | xargs)

# n8n 실행
n8n start
```

## 프로세스 관리

### PM2를 사용한 프로세스 관리 (권장)

#### PM2 설치
```bash
npm install pm2 -g
```

#### PM2로 n8n 실행
```bash
# 환경 변수 파일과 함께 실행
pm2 start n8n --name n8n -- start

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save
```

#### PM2 관리 명령어
```bash
# 상태 확인
pm2 status

# 로그 확인
pm2 logs n8n

# 재시작
pm2 restart n8n

# 중지
pm2 stop n8n
```

### systemd를 사용한 서비스 관리

#### 서비스 파일 생성
```bash
sudo nano /etc/systemd/system/n8n.service
```

#### 서비스 설정
```ini
[Unit]
Description=n8n - Workflow Automation
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/env n8n start
Restart=always
User=n8n
Group=n8n
EnvironmentFile=/home/n8n/.n8n/.env
WorkingDirectory=/home/n8n

[Install]
WantedBy=multi-user.target
```

#### 서비스 활성화
```bash
sudo systemctl daemon-reload
sudo systemctl enable n8n
sudo systemctl start n8n
sudo systemctl status n8n
```

## 보안 설정

### 1. SSL/TLS 설정

#### Nginx 리버스 프록시 설정
```bash
# Nginx 설치
sudo apt install nginx

# 설정 파일 생성
sudo nano /etc/nginx/sites-available/n8n
```

#### Nginx 설정 파일
```nginx
server {
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    listen 80;
}
```

#### Let's Encrypt SSL 인증서 설치
```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 설정
sudo crontab -e
# 다음 줄 추가: 0 2 * * * certbot renew --quiet --post-hook "systemctl restart nginx"
```

### 2. 방화벽 설정

```bash
# UFW 설치 및 설정
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

### 3. 추가 보안 설정

#### 환경 변수 업데이트
```env
# HTTPS 설정
N8N_PROTOCOL=https
N8N_WEBHOOK_URL=https://your-domain.com/

# 보안 헤더 설정
N8N_SECURE_COOKIE=true
```

## 백업 및 복원

### 1. 자동 백업 스크립트

```bash
#!/bin/bash
# backup-n8n.sh

BACKUP_DIR="/path/to/backup"
DATE=$(date +%Y%m%d_%H%M%S)

# 데이터베이스 백업
pg_dump -U n8nuser -W -F t n8n > $BACKUP_DIR/n8n_db_backup_$DATE.tar

# 설정 파일 백업
cp ~/.n8n/.env $BACKUP_DIR/n8n_env_backup_$DATE

# 워크플로우 백업 (n8n 내장 기능 사용)
# 수동으로 워크플로우 익스포트 필요

echo "Backup completed: $DATE"
```

### 2. 자동 백업 스케줄링

```bash
# cron 설정
crontab -e

# 매일 오전 2시에 백업 실행
0 2 * * * /path/to/backup-n8n.sh
```

## 업데이트 및 유지보수

### 1. n8n 업데이트

```bash
# 현재 버전 확인
n8n --version

# 전역 업데이트
npm update -g n8n

# 서비스 재시작
pm2 restart n8n
# 또는
sudo systemctl restart n8n
```

### 2. 모니터링

#### 리소스 모니터링
```bash
# 시스템 리소스 확인
top
htop
df -h
free -m
```

#### 로그 모니터링
```bash
# PM2 로그
pm2 logs n8n

# systemd 로그
journalctl -u n8n -f

# Nginx 로그
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 문제 해결

### 일반적인 문제들

1. **포트 충돌**
   - 다른 서비스가 5678 포트를 사용하는 경우
   - `N8N_PORT` 환경 변수로 포트 변경

2. **권한 문제**
   - n8n 사용자의 파일 접근 권한 확인
   - 데이터베이스 연결 권한 확인

3. **메모리 부족**
   - 서버 리소스 모니터링
   - 복잡한 워크플로우 최적화

4. **데이터베이스 연결 오류**
   - 환경 변수 설정 확인
   - 데이터베이스 서비스 상태 확인

### 로그 분석

```bash
# n8n 로그 위치 확인
ls -la ~/.n8n/logs/

# 에러 로그 확인
tail -f ~/.n8n/logs/n8n.log
```

## 장단점

### 장점
- **완전한 데이터 제어**: 모든 데이터가 자신의 서버에 저장
- **커스터마이징 가능**: 환경과 설정을 자유롭게 변경
- **비용 효율적**: 구독 비용 없이 사용 가능
- **보안**: 내부 네트워크에서만 접근 가능
- **확장성**: 필요에 따라 서버 리소스 조정 가능

### 단점
- **기술적 전문성 필요**: 서버 관리 및 유지보수 지식 필요
- **관리 부담**: 업데이트, 백업, 모니터링 등 직접 관리
- **초기 설정 복잡**: 다양한 구성 요소 설정 필요
- **장애 대응**: 문제 발생 시 직접 해결해야 함

## 결론

npm을 통한 n8n 호스팅은 완전한 제어권과 커스터마이징을 원하는 사용자에게 적합한 방법입니다. 초기 설정이 복잡할 수 있지만, 한 번 제대로 구성하면 안정적이고 효율적인 워크플로우 자동화 플랫폼을 구축할 수 있습니다.

정기적인 백업, 모니터링, 업데이트를 통해 안정적인 운영을 유지하고, 보안 설정을 철저히 하여 안전한 자동화 환경을 구축하시기 바랍니다.