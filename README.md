# Koperasi-App

## 🚀 Instruksi Setup

### Backend Setup

1. **Install Dependencies**
cd koperasi-backend
composer install
php artisan key:generate
php artisan migrate(jika tidak bisa gunakan php artisan migrate:fresh)
php artisan db:seed --class=UserSeeder

2. **Install Laravel Sanctum**
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

3. **Run Backend**
php artisan serve

### Frontend Setup
1. cd koperasi-frontend
2. npm install
3. npm run dev

Login Credentials
Admin: admin@koperasi.com / password
Karyawan: karyawan@koperasi.com / password
