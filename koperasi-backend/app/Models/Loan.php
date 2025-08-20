<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'application_date',
        'amount',
        'phone',
        'address',
        'status',
    ];

    protected $casts = [
        'application_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function settlement()
    {
        return $this->hasOne(Settlement::class);
    }
}
