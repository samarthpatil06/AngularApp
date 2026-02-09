# 1. Set the variables
$IP = "3.109.203.235"
$KEY = "mqtt-key.pem"
$BASE_PATH = "E:\Migcon Innovations Internship\Migcon\AngularApp\MigcoinApplication"

# 2. Upload the zip (Using ${IP} to avoid the drive-letter error)
scp -i $KEY "$BASE_PATH\dist\browser.zip" ubuntu@${IP}:~/

# 3. Upload the Nginx config
scp -i $KEY "$BASE_PATH\nginx.conf" ubuntu@${IP}:~/

# 4. Upload the Backend folder
# We go one level up from BASE_PATH to find the backend folder
scp -i $KEY -r "$BASE_PATH\..\backend" ubuntu@${IP}:~/