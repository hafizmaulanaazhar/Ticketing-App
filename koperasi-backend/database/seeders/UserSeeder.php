<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@koperasi.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '081234567890',
            'address' => 'Jl. Admin No. 1',
        ]);

        User::create([
            'name' => 'Karyawan',
            'email' => 'karyawan@koperasi.com',
            'password' => Hash::make('password'),
            'role' => 'karyawan',
            'phone' => '081234567891',
            'address' => 'Jl. Karyawan No. 2',
        ]);

        User::factory(10)->create();
    }
}
