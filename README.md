# Koperasi-App

## 🚀 Instruksi Setup

### Backend Setup

1. **Install Dependencies**
  1. cd koperasi-backend
  2. composer install
  3. php artisan key:generate
  4. php artisan migrate(jika tidak bisa gunakan php artisan migrate:fresh)
  5. php artisan db:seed --class=UserSeeder

2. **Install Laravel Sanctum**
  1. php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
  2. php artisan migrate

3. **Run Backend**
  1. php artisan serve

### Frontend Setup
1. cd koperasi-frontend
2. npm install
3. npm run dev

Login Credentials
Admin: admin@koperasi.com / password
Karyawan: karyawan@koperasi.com / password
