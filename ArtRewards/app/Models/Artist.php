<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Artist extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'bio',
    ];

    public function collections(): HasMany
    {
        return $this->hasMany(Collection::class);
    }
}


