<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Settlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_id',
        'settlement_date',
        'proof',
        'status',
    ];

    protected $casts = [
        'settlement_date' => 'date',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }
}
